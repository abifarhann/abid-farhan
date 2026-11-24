import { getPortfolioAssetPaths } from "@/data/portfolio";
import { readAssetVersions } from "@/lib/asset-versions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const headers = { "Cache-Control": "no-store" };
  if (process.env.NODE_ENV !== "development") return new Response(null, { status: 404, headers });
  return Response.json(await readAssetVersions(getPortfolioAssetPaths()), { headers });
}
