import { expect, test } from "@playwright/test";
import { spawn, execFileSync, type ChildProcess } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { portfolio } from "../../src/data/portfolio";

let fixture: string;
let server: ChildProcess;

test.beforeAll(async () => {
  // Copy only public app files into an ignored sandbox. Never mutate the user's assets.
  await mkdir("test-results", { recursive: true });
  fixture = await mkdtemp(join(process.cwd(), "test-results", "dev-fixture-"));
  for (const entry of ["src", "public", "package.json", "tsconfig.json", "postcss.config.mjs"]) {
    await cp(join(process.cwd(), entry), join(fixture, entry), { recursive: true });
  }
  server = spawn(process.execPath, [
    join(process.cwd(), "node_modules/next/dist/bin/next"),
    "dev", fixture, "--hostname", "127.0.0.1", "--port", "3101",
  ], { cwd: fixture, env: process.env, stdio: ["ignore", "pipe", "pipe"] });
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Isolated dev server did not become ready.")), 60_000);
    let output = "";
    const listen = (chunk: Buffer) => {
      output += chunk.toString();
      if (output.includes("Ready in")) {
        clearTimeout(timer);
        resolve();
      }
    };
    server.stdout?.on("data", listen);
    server.stderr?.on("data", listen);
    server.once("error", (error) => { clearTimeout(timer); reject(error); });
    server.once("exit", (code) => { clearTimeout(timer); reject(new Error(`Dev server exited (${code}): ${output}`)); });
  });
});

test.afterAll(async () => {
  if (server?.pid && server.exitCode === null) {
    if (process.platform === "win32") {
      execFileSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      const closed = new Promise((resolve) => server.once("exit", resolve));
      server.kill("SIGTERM");
      await closed;
    }
  }
  if (fixture) await rm(fixture, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
});

test("same-name photo, PDF and content edits update without manual refresh", async ({ page, request }) => {
  await page.goto("/");
  const image = page.getByRole("img", { name: portfolio.name, exact: true });
  await image.evaluate((element) => (element as HTMLImageElement).decode());
  const originalSrc = await image.getAttribute("src");
  expect(originalSrc).toContain("__dev_asset=");
  expect(originalSrc).not.toContain("/_next/image");
  await page.evaluate(() => Reflect.set(window, "__liveUpdateProbe", "preserved"));
  await page.locator("#nedo-studio-details summary").click();

  const photo = join(fixture, "public", portfolio.portrait!);
  // RIFF decoders ignore trailing bytes; this preserves a valid, visibly identical WebP.
  await writeFile(photo, Buffer.concat([await readFile(photo), Buffer.from("\n")]));
  await expect.poll(() => image.getAttribute("src"), { timeout: 30_000 }).not.toBe(originalSrc);
  await image.evaluate((element) => (element as HTMLImageElement).decode());
  expect(await page.evaluate(() => Reflect.get(window, "__liveUpdateProbe"))).toBe("preserved");
  await expect(page.locator("#nedo-studio-details")).toHaveAttribute("open", "");

  const resume = page.getByRole("link", { name: "View Résumé" });
  const originalResume = await resume.getAttribute("href");
  const pdf = join(fixture, "public", portfolio.contact.resume);
  await writeFile(pdf, Buffer.concat([await readFile(pdf), Buffer.from("\n% live-update-test\n")]));
  await expect.poll(() => resume.getAttribute("href"), { timeout: 30_000 }).not.toBe(originalResume);
  const response = await request.get((await resume.getAttribute("href"))!);
  expect(response.ok()).toBe(true);
  expect((await response.body()).includes(Buffer.from("% live-update-test"))).toBe(true);
  expect(await page.evaluate(() => Reflect.get(window, "__liveUpdateProbe"))).toBe("preserved");

  const contentFile = join(fixture, "src/data/portfolio.ts");
  const content = await readFile(contentFile, "utf8");
  expect(content).toContain(portfolio.intro);
  const updatedIntro = "Live updates verified: web applications, APIs, and collaborative interfaces.";
  await writeFile(contentFile, content.replace(portfolio.intro, updatedIntro));
  await expect(page.getByRole("heading", { name: updatedIntro, exact: true })).toBeVisible({ timeout: 30_000 });
});
