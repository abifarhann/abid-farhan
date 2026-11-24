import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { readAssetVersions, versionedAssetUrl } from "../src/lib/asset-versions.ts";

async function fixture(run) {
  const base = join(tmpdir(), "opencode");
  await mkdir(base, { recursive: true });
  const root = await mkdtemp(join(base, "portfolio-assets-"));
  try {
    await mkdir(join(root, "images"));
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("asset tracking is disabled outside development", async () => {
  assert.deepEqual(await readAssetVersions(["/images/photo.webp"], { enabled: false, root: "nonexistent" }), {});
  assert.equal(versionedAssetUrl("/images/photo.webp", {}), "/images/photo.webp");
});

test("same-name replacements change versions and deduplicate asset paths", () => fixture(async (root) => {
  const source = "/images/photo.webp";
  await writeFile(join(root, source), "original");
  const first = await readAssetVersions([source, source], { root, enabled: true });
  assert.equal(Object.keys(first).length, 1);
  await writeFile(join(root, source), "replacement photo");
  const second = await readAssetVersions([source], { root, enabled: true });
  assert.notEqual(first[source], second[source]);
  assert.notEqual(versionedAssetUrl(source, first), versionedAssetUrl(source, second));
}));

test("missing assets are detected when created", () => fixture(async (root) => {
  assert.deepEqual(await readAssetVersions(["/cv.pdf"], { root, enabled: true }), { "/cv.pdf": "missing" });
  await writeFile(join(root, "cv.pdf"), "%PDF-1.7");
  assert.notEqual((await readAssetVersions(["/cv.pdf"], { root, enabled: true }))["/cv.pdf"], "missing");
}));

test("external URLs, traversal paths and malformed encodings are not inspected", () => fixture(async (root) => {
  const versions = await readAssetVersions([
    "https://example.com/a.webp", "//example.com/a.webp", "/../private.txt",
    "/%2e%2e/private.txt", "/%E0%A4%A", "/images/../../private.txt",
  ], { root, enabled: true });
  assert.deepEqual(versions, {});
}));

test("version URLs preserve existing query parameters and fragments", () => {
  const source = "/cv.pdf?download=1#page=2";
  const url = new URL(versionedAssetUrl(source, { [source]: "new version" }), "http://localhost");
  assert.equal(url.searchParams.get("download"), "1");
  assert.equal(url.searchParams.get("__dev_asset"), "new version");
  assert.equal(url.hash, "#page=2");
});
