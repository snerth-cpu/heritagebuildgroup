import { randomUUID } from "crypto";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { LeadPhoto, LeadRecord } from "./types";

const LEADS_STORE_NAME = "hbg-estimate-leads";
const INDEX_KEY = "index.json";
const VERCEL_BLOB_PREFIX = "hbg-estimate-leads/";
/** Blobs calls that hang (missing/broken Netlify context) must not freeze the function. */
const BLOBS_OP_TIMEOUT_MS = 4000;

export type StoredPhoto = {
  filename: string;
  contentType: string;
  bytes: Uint8Array;
};

export type StorageBackend =
  | "netlify-blobs"
  | "netlify-deploy-blobs"
  | "netlify-blobs-token"
  | "vercel-blob"
  | "local-filesystem"
  | "unavailable";

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

type ResolvedNetlifyStore = {
  kind: "netlify";
  store: BlobStore;
  label: Exclude<StorageBackend, "local-filesystem" | "vercel-blob" | "unavailable">;
};

type ResolvedVercelStore = {
  kind: "vercel";
  label: "vercel-blob";
  token: string;
};

type ResolvedLocalStore = {
  kind: "local";
  label: "local-filesystem";
};

type ResolvedBackend = ResolvedNetlifyStore | ResolvedVercelStore | ResolvedLocalStore;

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

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new LeadStorageError("blobs_timeout", `Timed out during ${label} after ${ms}ms`));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
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

function vercelBlobToken() {
  return env("BLOB_READ_WRITE_TOKEN") || env("VERCEL_BLOB_READ_WRITE_TOKEN") || null;
}

let cachedNetlify: ResolvedNetlifyStore | null | undefined;
let cachedStoreErrors: string[] = [];
let blobsModulePromise: Promise<{
  getStore: (input: unknown, options?: unknown) => BlobStore;
  getDeployStore: (input?: unknown, options?: unknown) => BlobStore;
} | null> | null = null;

async function loadBlobsModule() {
  if (!blobsModulePromise) {
    blobsModulePromise = withTimeout(
      import("@netlify/blobs").then((mod) => ({
        getStore: mod.getStore as unknown as (input: unknown, options?: unknown) => BlobStore,
        getDeployStore: mod.getDeployStore as unknown as (
          input?: unknown,
          options?: unknown,
        ) => BlobStore,
      })),
      BLOBS_OP_TIMEOUT_MS,
      "import(@netlify/blobs)",
    ).catch((error) => {
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
 */
async function resolveNetlifyBlobStore(): Promise<ResolvedNetlifyStore | null> {
  if (cachedNetlify !== undefined) return cachedNetlify;

  const errors: string[] = [];
  const creds = explicitBlobsCredentials();
  if (!hasBlobsContext() && !creds) {
    cachedNetlify = null;
    cachedStoreErrors = [
      isNetlifyRuntime()
        ? "NETLIFY_BLOBS_CONTEXT missing in Next runtime (no Blobs auto-context)"
        : "not on Netlify and no NETLIFY_SITE_ID/NETLIFY_AUTH_TOKEN",
    ];
    return null;
  }

  const blobs = await loadBlobsModule();
  if (!blobs) {
    cachedNetlify = null;
    cachedStoreErrors = ["import @netlify/blobs failed or timed out"];
    return null;
  }

  const attempts: Array<{ label: ResolvedNetlifyStore["label"]; open: () => BlobStore }> = [];

  if (hasBlobsContext()) {
    attempts.push({
      label: "netlify-blobs",
      open: () => blobs.getStore(LEADS_STORE_NAME),
    });
    attempts.push({
      label: "netlify-deploy-blobs",
      open: () => blobs.getDeployStore(LEADS_STORE_NAME),
    });
  }

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

  for (const attempt of attempts) {
    try {
      const store = attempt.open();
      cachedNetlify = { kind: "netlify", store, label: attempt.label };
      cachedStoreErrors = [];
      return cachedNetlify;
    } catch (error) {
      errors.push(`${attempt.label}: ${errText(error)}`);
    }
  }

  cachedStoreErrors = errors;
  cachedNetlify = null;
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

async function requireBackend(): Promise<ResolvedBackend> {
  const netlify = await resolveNetlifyBlobStore();
  if (netlify) return netlify;

  const token = vercelBlobToken();
  if (token) {
    return { kind: "vercel", label: "vercel-blob", token };
  }

  if (await canWriteLocalFs()) {
    return { kind: "local", label: "local-filesystem" };
  }

  const detail =
    cachedStoreErrors.slice(0, 3).join(" | ") ||
    "no Netlify Blobs / Vercel Blob token; filesystem not writable on this host";
  throw new LeadStorageError(
    "storage_unavailable",
    "Lead storage is unavailable on this host.",
    detail,
  );
}

async function blobsSet(store: BlobStore, key: string, value: string | ArrayBuffer, options?: {
  metadata?: Record<string, string>;
}) {
  await withTimeout(Promise.resolve(store.set(key, value, options)), BLOBS_OP_TIMEOUT_MS, `blobs.set(${key})`);
}

async function blobsGet(store: BlobStore, key: string) {
  return withTimeout(
    Promise.resolve(store.get(key, { type: "text" })),
    BLOBS_OP_TIMEOUT_MS,
    `blobs.get(${key})`,
  );
}

async function vercelPut(
  token: string,
  key: string,
  body: string | Buffer,
  contentType: string,
) {
  const { put } = await import("@vercel/blob");
  return withTimeout(
    put(`${VERCEL_BLOB_PREFIX}${key}`, body, {
      access: "private",
      token,
      contentType,
      addRandomSuffix: false,
      allowOverwrite: true,
    }),
    BLOBS_OP_TIMEOUT_MS * 2,
    `vercel.blob.put(${key})`,
  );
}

async function vercelGetText(token: string, key: string): Promise<string | null> {
  const { list } = await import("@vercel/blob");
  const prefix = `${VERCEL_BLOB_PREFIX}${key}`;
  const listed = await withTimeout(
    list({ prefix, token, limit: 5 }),
    BLOBS_OP_TIMEOUT_MS,
    `vercel.blob.list(${key})`,
  );
  const match = listed.blobs.find((b) => b.pathname === prefix) || listed.blobs[0];
  if (!match) return null;
  const res = await withTimeout(
    fetch(match.url, { headers: { Authorization: `Bearer ${token}` } }),
    BLOBS_OP_TIMEOUT_MS,
    `vercel.blob.fetch(${key})`,
  );
  if (!res.ok) return null;
  return res.text();
}

async function readIndex(backend: ResolvedBackend): Promise<string[]> {
  if (backend.kind === "netlify") {
    const raw = await blobsGet(backend.store, INDEX_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as string[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  if (backend.kind === "vercel") {
    const raw = await vercelGetText(backend.token, INDEX_KEY);
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

async function writeIndex(backend: ResolvedBackend, ids: string[]) {
  const body = JSON.stringify(ids.slice(0, 5000));
  if (backend.kind === "netlify") {
    await blobsSet(backend.store, INDEX_KEY, body);
    return;
  }
  if (backend.kind === "vercel") {
    await vercelPut(backend.token, INDEX_KEY, body, "application/json");
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
  const id = record.id || randomUUID();
  const photos: LeadPhoto[] = [];

  try {
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const safeName = file.filename.replace(/[^\w.\-]+/g, "_").slice(0, 80) || `photo-${i + 1}`;
      const key = `photos/${id}/${i}-${safeName}`;
      const buffer = Buffer.from(file.bytes);
      if (backend.kind === "netlify") {
        const ab = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        await blobsSet(backend.store, key, ab as ArrayBuffer, {
          metadata: { contentType: file.contentType, filename: safeName },
        });
      } else if (backend.kind === "vercel") {
        await vercelPut(backend.token, key, buffer, file.contentType || "application/octet-stream");
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

    if (backend.kind === "netlify") {
      await blobsSet(backend.store, `leads/${id}.json`, payload);
    } else if (backend.kind === "vercel") {
      await vercelPut(backend.token, `leads/${id}.json`, payload, "application/json");
    } else {
      const root = localRoot();
      await mkdir(path.join(root, "leads"), { recursive: true });
      await writeFile(path.join(root, "leads", `${id}.json`), payload, "utf8");
    }

    const index = await readIndex(backend);
    if (!index.includes(id)) {
      index.unshift(id);
      await writeIndex(backend, index);
    }

    return lead;
  } catch (error) {
    if (backend.kind === "netlify") {
      cachedNetlify = undefined;
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
    if (backend.kind === "netlify") {
      await blobsSet(backend.store, `leads/${lead.id}.json`, payload);
    } else if (backend.kind === "vercel") {
      await vercelPut(backend.token, `leads/${lead.id}.json`, payload, "application/json");
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

  if (backend.kind === "netlify") {
    const raw = await blobsGet(backend.store, `leads/${id}.json`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LeadRecord;
    } catch {
      return null;
    }
  }

  if (backend.kind === "vercel") {
    const raw = await vercelGetText(backend.token, `leads/${id}.json`);
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

  const ids = (await readIndex(backend)).slice(0, Math.min(200, Math.max(1, limit)));
  const leads: LeadRecord[] = [];

  for (const id of ids) {
    const lead = await getLead(id);
    if (lead) leads.push(lead);
  }

  if (!leads.length && backend.kind === "local") {
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
  try {
    const backend = await requireBackend();
    return backend.label;
  } catch {
    return "unavailable";
  }
}

export function storageDiagnostics() {
  return {
    netlify: env("NETLIFY") === "true",
    netlifyDev: env("NETLIFY_DEV") === "true",
    context: env("CONTEXT") || null,
    vercel: Boolean(env("VERCEL")),
    hasBlobsContext: hasBlobsContext(),
    hasExplicitCredentials: Boolean(explicitBlobsCredentials()),
    hasVercelBlobToken: Boolean(vercelBlobToken()),
    blobErrors: cachedStoreErrors.slice(0, 3),
  };
}
