import { randomUUID } from "crypto";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { LeadPhoto, LeadRecord } from "./types";

const LEADS_STORE_NAME = "hbg-estimate-leads";
const INDEX_KEY = "index.json";

export type StoredPhoto = {
  filename: string;
  contentType: string;
  bytes: Uint8Array;
};

export type StorageBackend =
  | "netlify-blobs"
  | "netlify-deploy-blobs"
  | "netlify-blobs-token"
  | "local-filesystem";

export class LeadStorageError extends Error {
  code: string;
  causeDetail?: string;

  constructor(code: string, message: string, causeDetail?: string) {
    super(message);
    this.name = "LeadStorageError";
    this.code = code;
    this.causeDetail = causeDetail;
  }
}

type BlobStore = {
  get: (key: string, options?: { type?: string }) => Promise<string | null>;
  set: (
    key: string,
    value: string | ArrayBuffer,
    options?: { metadata?: Record<string, string> },
  ) => Promise<unknown>;
};

type ResolvedStore = {
  store: BlobStore;
  label: Exclude<StorageBackend, "local-filesystem">;
};

/** Dynamic lookup avoids Next.js build-time inlining of `process.env.FOO` literals. */
function env(name: string) {
  return process.env[name];
}

function localRoot() {
  return env("LEADS_LOCAL_DIR") || path.join(process.cwd(), ".data", "leads");
}

function errText(error: unknown) {
  if (error instanceof Error) return `${error.name}: ${error.message}`.slice(0, 400);
  return String(error).slice(0, 400);
}

function hasBlobsContext() {
  const globalContext = (globalThis as { netlifyBlobsContext?: unknown }).netlifyBlobsContext;
  return Boolean(globalContext || env("NETLIFY_BLOBS_CONTEXT"));
}

function isNetlifyRuntime() {
  return (
    env("NETLIFY") === "true" ||
    env("NETLIFY_DEV") === "true" ||
    Boolean(env("CONTEXT")) ||
    hasBlobsContext()
  );
}

function isServerlessReadonlyHost() {
  // Deployed Netlify / Vercel filesystems are not durable for lead JSON.
  // Local `netlify dev` sets NETLIFY_DEV and can use the filesystem.
  if (env("NETLIFY_DEV") === "true") return false;
  return env("NETLIFY") === "true" || Boolean(env("VERCEL"));
}

function explicitBlobsCredentials() {
  const siteID = env("NETLIFY_SITE_ID") || env("NETLIFY_BLOBS_SITE_ID") || env("SITE_ID");
  const token = env("NETLIFY_AUTH_TOKEN") || env("NETLIFY_BLOBS_TOKEN") || env("NETLIFY_TOKEN");
  if (siteID && token) return { siteID, token };
  return null;
}

let cachedStore: ResolvedStore | null | undefined;
let cachedStoreErrors: string[] = [];
let blobsModulePromise: Promise<{
  getStore: (input: unknown, options?: unknown) => BlobStore;
  getDeployStore: (input?: unknown, options?: unknown) => BlobStore;
} | null> | null = null;

async function loadBlobsModule() {
  if (!blobsModulePromise) {
    blobsModulePromise = import("@netlify/blobs")
      .then((mod) => ({
        getStore: mod.getStore as unknown as (input: unknown, options?: unknown) => BlobStore,
        getDeployStore: mod.getDeployStore as unknown as (
          input?: unknown,
          options?: unknown,
        ) => BlobStore,
      }))
      .catch((error) => {
        console.error("[estimate/store] failed to import @netlify/blobs:", errText(error));
        return null;
      });
  }
  return blobsModulePromise;
}

/**
 * Resolve a Netlify Blobs store.
 * On Netlify, prefer automatic site context and do NOT pass siteID/token first —
 * explicit credentials replace the injected runtime context and often break writes.
 *
 * Do not probe with store.get() during resolve — a hanging/misconfigured edge
 * endpoint previously caused Netlify function timeouts (502/504).
 */
async function resolveBlobStore(): Promise<ResolvedStore | null> {
  if (cachedStore !== undefined) return cachedStore;

  const errors: string[] = [];
  const blobs = await loadBlobsModule();
  if (!blobs) {
    cachedStore = null;
    cachedStoreErrors = ["import @netlify/blobs failed"];
    return null;
  }

  const attempts: Array<{ label: ResolvedStore["label"]; open: () => BlobStore }> = [];

  // 1) Automatic Netlify runtime context (Deploy Preview + production on Netlify).
  if (hasBlobsContext() || isNetlifyRuntime()) {
    attempts.push({
      label: "netlify-blobs",
      open: () => blobs.getStore(LEADS_STORE_NAME),
    });
    attempts.push({
      label: "netlify-deploy-blobs",
      open: () => blobs.getDeployStore(LEADS_STORE_NAME),
    });
  }

  // 2) Explicit token path for off-Netlify hosts (e.g. Vercel) or local tooling.
  const creds = explicitBlobsCredentials();
  if (creds) {
    attempts.push({
      label: "netlify-blobs-token",
      open: () =>
        blobs.getStore({
          name: LEADS_STORE_NAME,
          siteID: creds.siteID,
          token: creds.token,
        }),
    });
  }

  // 3) Last chance: try automatic getStore even if env detection missed Netlify.
  if (!attempts.length) {
    attempts.push({
      label: "netlify-blobs",
      open: () => blobs.getStore(LEADS_STORE_NAME),
    });
  }

  for (const attempt of attempts) {
    try {
      const store = attempt.open();
      cachedStore = { store, label: attempt.label };
      cachedStoreErrors = [];
      return cachedStore;
    } catch (error) {
      errors.push(`${attempt.label}: ${errText(error)}`);
    }
  }

  cachedStoreErrors = errors;
  cachedStore = null;
  if (errors.length) {
    console.error("[estimate/store] Netlify Blobs unavailable:", errors.join(" | "));
  }
  return null;
}

async function canWriteLocalFs() {
  if (isServerlessReadonlyHost()) return false;
  try {
    const root = localRoot();
    await mkdir(root, { recursive: true });
    const probe = path.join(root, ".write-probe");
    await writeFile(probe, String(Date.now()), "utf8");
    return true;
  } catch (error) {
    console.error("[estimate/store] local filesystem not writable:", errText(error));
    return false;
  }
}

async function requireBackend(): Promise<
  { kind: "blobs"; store: BlobStore; label: StorageBackend } | { kind: "local"; label: "local-filesystem" }
> {
  const blobs = await resolveBlobStore();
  if (blobs) return { kind: "blobs", store: blobs.store, label: blobs.label };

  if (await canWriteLocalFs()) {
    return { kind: "local", label: "local-filesystem" };
  }

  const detail = cachedStoreErrors.slice(0, 3).join(" | ") || "no blob context; filesystem not writable";
  throw new LeadStorageError(
    "storage_unavailable",
    "Lead storage is unavailable on this host.",
    detail,
  );
}

async function readIndex(store: BlobStore | null): Promise<string[]> {
  if (store) {
    const raw = await store.get(INDEX_KEY, { type: "text" });
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as string[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  const indexPath = path.join(localRoot(), INDEX_KEY);
  try {
    const raw = await readFile(indexPath, "utf8");
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeIndex(store: BlobStore | null, ids: string[]) {
  const body = JSON.stringify(ids.slice(0, 5000));
  if (store) {
    await store.set(INDEX_KEY, body);
    return;
  }
  const root = localRoot();
  await mkdir(root, { recursive: true });
  await writeFile(path.join(root, INDEX_KEY), body, "utf8");
}

export async function saveLead(
  record: Omit<LeadRecord, "photos"> & { photos?: LeadPhoto[] },
  files: StoredPhoto[],
): Promise<LeadRecord> {
  const backend = await requireBackend();
  const store = backend.kind === "blobs" ? backend.store : null;
  const id = record.id || randomUUID();
  const photos: LeadPhoto[] = [];

  try {
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const safeName = file.filename.replace(/[^\w.\-]+/g, "_").slice(0, 80) || `photo-${i + 1}`;
      const key = `photos/${id}/${i}-${safeName}`;
      const buffer = Buffer.from(file.bytes);
      if (store) {
        // Netlify Blobs accepts ArrayBuffer; Buffer typing is stricter under TS 5.x.
        const ab = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        await store.set(key, ab as ArrayBuffer, {
          metadata: { contentType: file.contentType, filename: safeName },
        });
      } else {
        const root = localRoot();
        const dir = path.join(root, "photos", id);
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, `${i}-${safeName}`), buffer);
      }
      photos.push({
        key,
        filename: safeName,
        contentType: file.contentType,
        size: file.bytes.byteLength,
      });
    }

    const lead: LeadRecord = { ...record, id, photos };
    const payload = JSON.stringify(lead, null, 2);

    if (store) {
      await store.set(`leads/${id}.json`, payload);
    } else {
      const root = localRoot();
      await mkdir(path.join(root, "leads"), { recursive: true });
      await writeFile(path.join(root, "leads", `${id}.json`), payload, "utf8");
    }

    const index = await readIndex(store);
    if (!index.includes(id)) {
      index.unshift(id);
      await writeIndex(store, index);
    }

    return lead;
  } catch (error) {
    // If the first Blobs backend opened but writes fail, clear cache so a later
    // request can try deploy-store / token fallbacks.
    if (backend.kind === "blobs") {
      cachedStore = undefined;
    }
    if (error instanceof LeadStorageError) throw error;
    throw new LeadStorageError("save_failed", "Could not persist the lead record.", errText(error));
  }
}

/** Update lead JSON in place without rewriting photo blobs. */
export async function updateLead(lead: LeadRecord): Promise<LeadRecord> {
  const backend = await requireBackend();
  const payload = JSON.stringify(lead, null, 2);
  try {
    if (backend.kind === "blobs") {
      await backend.store.set(`leads/${lead.id}.json`, payload);
    } else {
      const root = localRoot();
      await mkdir(path.join(root, "leads"), { recursive: true });
      await writeFile(path.join(root, "leads", `${lead.id}.json`), payload, "utf8");
    }
  } catch (error) {
    if (error instanceof LeadStorageError) throw error;
    throw new LeadStorageError("update_failed", "Could not update the lead record.", errText(error));
  }
  return lead;
}

export async function getLead(id: string): Promise<LeadRecord | null> {
  if (!/^[0-9a-f-]{10,64}$/i.test(id)) return null;
  const backend = await requireBackend().catch(() => null);
  if (!backend) return null;

  if (backend.kind === "blobs") {
    const raw = await backend.store.get(`leads/${id}.json`, { type: "text" });
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LeadRecord;
    } catch {
      return null;
    }
  }

  try {
    const raw = await readFile(path.join(localRoot(), "leads", `${id}.json`), "utf8");
    return JSON.parse(raw) as LeadRecord;
  } catch {
    return null;
  }
}

export async function listLeads(limit = 50): Promise<LeadRecord[]> {
  const backend = await requireBackend().catch(() => null);
  if (!backend) return [];

  const store = backend.kind === "blobs" ? backend.store : null;
  const ids = (await readIndex(store)).slice(0, Math.min(200, Math.max(1, limit)));
  const leads: LeadRecord[] = [];

  for (const id of ids) {
    const lead = await getLead(id);
    if (lead) leads.push(lead);
  }

  // Local fallback if index missing but files exist
  if (!leads.length && !store) {
    try {
      const dir = path.join(localRoot(), "leads");
      const files = (await readdir(dir)).filter((f) => f.endsWith(".json")).sort().reverse();
      for (const file of files.slice(0, limit)) {
        const raw = await readFile(path.join(dir, file), "utf8");
        leads.push(JSON.parse(raw) as LeadRecord);
      }
    } catch {
      /* empty */
    }
  }

  return leads;
}

export async function storageBackendLabel(): Promise<StorageBackend> {
  const blobs = await resolveBlobStore();
  if (blobs) return blobs.label;
  if (await canWriteLocalFs()) return "local-filesystem";
  return "local-filesystem";
}

export function storageDiagnostics() {
  return {
    netlify: env("NETLIFY") === "true",
    netlifyDev: env("NETLIFY_DEV") === "true",
    context: env("CONTEXT") || null,
    vercel: Boolean(env("VERCEL")),
    hasBlobsContext: hasBlobsContext(),
    hasExplicitCredentials: Boolean(explicitBlobsCredentials()),
    blobErrors: cachedStoreErrors.slice(0, 3),
  };
}
