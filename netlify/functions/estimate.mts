/**
 * Native Netlify Function for /api/estimate.
 * Next.js App Router handlers on Netlify often lack NETLIFY_BLOBS_CONTEXT;
 * Functions v2 receive Blobs site context automatically.
 */
import { handleEstimateGet, handleEstimatePost } from "../../lib/estimate/handler";

export default async (request: Request) => {
  if (request.method === "GET") return handleEstimateGet();
  if (request.method === "POST") return handleEstimatePost(request);
  return new Response(JSON.stringify({ ok: false, errors: { form: "Method not allowed." } }), {
    status: 405,
    headers: { "content-type": "application/json", allow: "GET, POST" },
  });
};
