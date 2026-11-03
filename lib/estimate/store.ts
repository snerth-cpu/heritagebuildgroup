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

function localRoot() {
  return process.env.LEADS_LOCAL_DIR || path.join(process.cwd(), ".data", "leads");
}

async function tryGetNetlifyStore() {
  try {
    const { getStore } = await import("@netlify/blobs");
    // On Netlify, site context is automatic. Off-Netlify, set NETLIFY_SITE_ID + NETLIFY_AUTH_TOKEN
    // (or NETLIFY_BLOBS_TOKEN) so production/Vercel can still use the same private store.
    const siteID = process.env.NETLIFY_SITE_ID || process.env.NETLIFY_BLOBS_SITE_ID;
    const token =
      process.env.NETLIFY_AUTH_TOKEN ||
      process.env.NETLIFY_BLOBS_TOKEN ||
      process.env.NETLIFY_TOKEN;

    if (siteID && token) {
      return getStore({ name: LEADS_STORE_NAME, siteID, token });
    }

    // Runtime on Netlify provides context without explicit credentials.
    if (process.env.NETLIFY === "true" || process.env.CONTEXT || process.env.NETLIFY_DEV === "true") {
      return getStore(LEADS_STORE_NAME);
    }
  } catch {
    /* fall through to local */
  }
  return null;
}

async function readIndex(store: Awaited<ReturnType<typeof tryGetNetlifyStore>>): Promise<string[]> {
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

async function writeIndex(store: Awaited<ReturnType<typeof tryGetNetlifyStore>>, ids: string[]) {
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
  const store = await tryGetNetlifyStore();
  const id = record.id || randomUUID();
  const photos: LeadPhoto[] = [];

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
}

/** Update lead JSON in place without rewriting photo blobs. */
export async function updateLead(lead: LeadRecord): Promise<LeadRecord> {
  const store = await tryGetNetlifyStore();
  const payload = JSON.stringify(lead, null, 2);
  if (store) {
    await store.set(`leads/${lead.id}.json`, payload);
  } else {
    const root = localRoot();
    await mkdir(path.join(root, "leads"), { recursive: true });
    await writeFile(path.join(root, "leads", `${lead.id}.json`), payload, "utf8");
  }
  return lead;
}

export async function getLead(id: string): Promise<LeadRecord | null> {
  if (!/^[0-9a-f-]{10,64}$/i.test(id)) return null;
  const store = await tryGetNetlifyStore();

  if (store) {
    const raw = await store.get(`leads/${id}.json`, { type: "text" });
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
  const store = await tryGetNetlifyStore();
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

export async function storageBackendLabel() {
  const store = await tryGetNetlifyStore();
  return store ? "netlify-blobs" : "local-filesystem";
}
