import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("website source and documentation do not use em dashes", async () => {
  async function check(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
      if (entry.isDirectory()) await check(path);
      else if (/\.(tsx?|css|svg)$/.test(entry.name)) {
        assert.ok(!(await readFile(path, "utf8")).includes("\u2014"), `Unexpected punctuation in ${path.pathname}`);
      }
    }
  }
  await check(new URL("../src/", import.meta.url));
  assert.ok(!(await readFile(new URL("../README.md", import.meta.url), "utf8")).includes("\u2014"));
});
