import { handleEstimateGet, handleEstimatePost } from "@/lib/estimate/handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return handleEstimateGet();
}

export async function POST(request: Request) {
  return handleEstimatePost(request);
}
