import { stat } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";

export type AssetVersions = Record<string, string>;

export async function readAssetVersions(
  sources: readonly string[],
  { enabled = process.env.NODE_ENV === "development", root = resolve("public") } = {},
): Promise<AssetVersions> {
  if (!enabled) return {};
  const entries = await Promise.all([...new Set(sources)].sort().map(async (source) => {
    if (!source.startsWith("/") || source.startsWith("//")) return null;
    let pathname: string;
    try {
      pathname = decodeURIComponent(source.split(/[?#]/, 1)[0]);
    } catch {
      return null;
    }
    const file = resolve(root, `.${pathname}`);
    const location = relative(root, file);
    if (!location || location === ".." || location.startsWith(`..${sep}`) || isAbsolute(location)) return null;
    try {
      const info = await stat(file, { bigint: true });
      if (!info.isFile()) return null;
      return [source, `${info.size}-${info.mtimeNs}-${info.ctimeNs}`] as const;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [source, "missing"] as const;
      return [source, "unavailable"] as const;
    }
  }));
  return Object.fromEntries(entries.filter((entry) => entry !== null));
}

export function versionedAssetUrl(source: string, versions: AssetVersions): string {
  if (!source || !versions[source]) return source;
  const url = new URL(source, "http://localhost");
  url.searchParams.set("__dev_asset", versions[source]);
  return `${url.pathname}${url.search}${url.hash}`;
}
