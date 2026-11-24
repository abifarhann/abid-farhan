import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { portfolio } from "../../src/data/portfolio";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
});

test("all sections fit the viewport, with readable labels and valid anchors", async ({ page }, testInfo) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  for (const id of ["about", "work", "experience", "skills", "contact"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  const layout = await page.evaluate(() => ({
    viewport: window.innerWidth,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    brokenAnchors: [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
      .filter((link) => !document.getElementById(link.hash.slice(1)))
      .map((link) => link.hash),
    labelSizes: [...document.querySelectorAll(".section-kicker, .project-stack, .project-category, .footer-bottom")]
      .map((element) => parseFloat(getComputedStyle(element).fontSize)),
    navTargets: [...document.querySelectorAll(".nav-links a")].map((element) => element.getBoundingClientRect().height),
  }));
  expect(layout.viewport).toBe(testInfo.project.use.viewport?.width);
  expect(layout.overflow).toBe(false);
  expect(layout.brokenAnchors).toEqual([]);
  await expect(page.locator('a[href=""], a[href="#"]')).toHaveCount(0);
  expect(layout.labelSizes.every((size) => size >= 12)).toBe(true);
  expect(layout.navTargets.every((height) => height >= 44)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("portfolio.png"), fullPage: true });
});

test("contact button stays compact with a comfortable touch target", async ({ page }, testInfo) => {
  const button = page.locator(".contact-button");
  await button.scrollIntoViewIfNeeded();
  await expect(button).toHaveAttribute("href", `mailto:${portfolio.contact.email}`);
  const bounds = await button.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.height).toBeGreaterThanOrEqual(44);
  expect(bounds!.height).toBeLessThanOrEqual(48);
  expect(bounds!.width).toBeLessThanOrEqual(160);
  await button.focus();
  await expect(button).toHaveCSS("outline-style", "solid");
  await page.locator("#contact").screenshot({ path: testInfo.outputPath("contact.png") });
});

test("hero portrait stays centered in the original editorial composition", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const composition = await page.locator(".hero-stage").evaluate((element) => {
    const stage = element.getBoundingClientRect();
    const portrait = document.querySelector(".portrait")!.getBoundingClientRect();
    return {
      horizontalOffset: Math.abs((portrait.left + portrait.width / 2) - (stage.left + stage.width / 2)),
      verticalOffset: Math.abs((portrait.top + portrait.height / 2) - (stage.top + stage.height / 2)),
    };
  });
  expect(composition.horizontalOffset).toBeLessThanOrEqual(1);
  expect(composition.verticalOffset).toBeLessThanOrEqual(1);
  await page.screenshot({ path: testInfo.outputPath("hero.png") });
});

test("skip link and project details work with the keyboard", async ({ page }) => {
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();

  const preview = page.getByRole("link", { name: "Read about Real-Time Collaborative Low-Code Editor" });
  await preview.focus();
  await page.keyboard.press("Enter");
  const details = page.locator("#nedo-studio-details");
  const summary = details.locator("summary");
  await expect(details).toHaveAttribute("open", "");
  await expect(summary).toBeFocused();
  await expect(summary).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Space");
  await expect(details).not.toHaveAttribute("open");
  await page.keyboard.press("Enter");
  await expect(details).toHaveAttribute("open", "");
});

test("navigation and direct project links work without page errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.getByRole("navigation").getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await page.goto("/#product-portal-details");
  await expect(page.locator("#product-portal-details")).toHaveAttribute("open", "");
  await expect(page.locator("#product-portal-details summary")).toBeFocused();
  await page.goto("/#%E0%A4%A");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(errors).toEqual([]);
});

test("reduced motion disables scroll animation, including a preference change", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator("#skills").scrollIntoViewIfNeeded();
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  expect(await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === "running").length)).toBe(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === "running").length)).toBe(0);
});

test("hero entrances are finite and image hover responds smoothly", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const entrances = await page.locator(".navigation, .hero-name, .portrait, .hero-bottom").evaluateAll((elements) => elements.map((element) => {
    const style = getComputedStyle(element);
    return { name: style.animationName, iterations: style.animationIterationCount, duration: parseFloat(style.animationDuration) };
  }));
  expect(entrances.every((animation) => animation.name !== "none" && animation.iterations === "1" && animation.duration > 0)).toBe(true);
  await page.locator(".hero").evaluate(async (element) => {
    await Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => {})));
  });
  await expect(page.locator(".hero-name")).toHaveCSS("opacity", "1");
  const image = page.locator(".project-image").first();
  await image.hover();
  await expect.poll(() => image.locator(".image-open").evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
});

test("page and expanded project details pass automated WCAG checks", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".project-details").evaluateAll((elements) => {
    elements.forEach((element) => (element as HTMLDetailsElement).open = true);
  });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map(({ id, nodes }) => ({
    id,
    elements: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
  }))).toEqual([]);
});

test("sharing metadata, favicon and social image are available", async ({ page, request }) => {
  expect((await request.get("/api/dev-assets")).status()).toBe(404);
  await expect(page).toHaveTitle("Abid Farhan Abdullah | Full-Stack Developer");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Abid Farhan/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /Abid Farhan/);
  if (portfolio.siteUrl) {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new URL("/", portfolio.siteUrl).href);
  } else {
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  }
  const iconPath = await page.locator('link[rel="icon"]').first().getAttribute("href");
  expect(iconPath).toBeTruthy();
  expect((await request.get(iconPath!)).ok()).toBe(true);
  // Follow the local route even when metadataBase is the configured public origin.
  const image = new URL((await page.locator('meta[property="og:image"]').getAttribute("content"))!);
  const response = await request.get(image.pathname + image.search);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("image/png");
  const png = await response.body();
  expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
});

test("current CV details, contact links, and résumé PDF are available", async ({ page, request }) => {
  await expect(page.locator(".experience-panel")).toHaveCount(3);
  for (const job of portfolio.experience) {
    const panel = page.locator(".experience-panel").filter({ has: page.getByRole("heading", { name: job.company, exact: true }) });
    await expect(panel).toContainText(job.role);
    await expect(panel).toContainText(job.period);
  }
  await expect(page.locator(".experience-panel").filter({ hasText: "Aidigital" })).toHaveCount(0);
  await expect(page.locator(".project-archive .archive-project")).toHaveCount(3);
  for (const project of portfolio.additionalProjects) {
    const archive = page.locator(`#${project.id}-details`);
    await archive.locator("summary").click();
    await expect(archive).toContainText(project.summary);
  }
  const resume = page.getByRole("link", { name: "View Résumé" });
  await expect(resume).toHaveAttribute("href", portfolio.contact.resume);
  await expect(resume).toHaveAttribute("target", "_blank");
  await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", portfolio.contact.linkedin);
  await expect(page.getByRole("link", { name: portfolio.contact.phone })).toHaveAttribute("href", "tel:+6285730859367");
  await expect(page.locator(".certifications")).toContainText("Expired Jan 2026");
  const response = await request.get(portfolio.contact.resume);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  const panels = await page.locator(".experience-panel").evaluateAll((elements) => elements.map((element) => {
    const { left, right, top, bottom } = element.getBoundingClientRect();
    return { left, right, top, bottom };
  }));
  for (let i = 0; i < panels.length; i++) {
    for (let j = i + 1; j < panels.length; j++) {
      const a = panels[i], b = panels[j];
      expect(a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top).toBe(false);
    }
  }
});

for (const project of [...portfolio.projects, ...portfolio.additionalProjects]) {
test(`${project.id} disclosure animates both ways and handles rapid clicks and reduced motion`, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const details = page.locator(`#${project.id}-details`);
  await details.scrollIntoViewIfNeeded();
  const opening = await details.evaluate((element) => {
    const closedHeight = element.getBoundingClientRect().height;
    element.querySelector("summary")!.click();
    const animation = element.getAnimations().find((item) => item.effect instanceof KeyframeEffect && item.effect.getKeyframes().some((frame) => "height" in frame));
    if (!animation) throw new Error("Opening height animation was not started.");
    animation.pause();
    animation.currentTime = 90;
    const midHeight = element.getBoundingClientRect().height;
    const content = element.querySelector(".disclosure-motion-content")!;
    const fade = content.getAnimations()[0];
    if (!fade) throw new Error("Opening content fade was not started.");
    fade.pause();
    fade.currentTime = 240;
    const midOpacity = Number(getComputedStyle(content).opacity);
    animation.finish();
    return { closedHeight, midHeight, midOpacity };
  });
  expect(opening.midHeight).toBeGreaterThan(opening.closedHeight);
  expect(opening.midOpacity).toBeGreaterThan(0);
  expect(opening.midOpacity).toBeLessThan(1);
  await expect(details).not.toHaveAttribute("data-disclosure-state");
  const closing = await details.evaluate((element) => {
    const openHeight = element.getBoundingClientRect().height;
    element.querySelector("summary")!.click();
    const animation = element.getAnimations().find((item) => item.effect instanceof KeyframeEffect && item.effect.getKeyframes().some((frame) => "height" in frame));
    if (!animation) throw new Error("Closing height animation was not started.");
    animation.pause();
    animation.currentTime = 90;
    const midHeight = element.getBoundingClientRect().height;
    const content = element.querySelector(".disclosure-motion-content")!;
    const fade = content.getAnimations()[0];
    if (!fade) throw new Error("Closing content fade was not started.");
    fade.pause();
    fade.currentTime = 240;
    const midOpacity = Number(getComputedStyle(content).opacity);
    animation.finish();
    return { openHeight, midHeight, midOpacity };
  });
  expect(closing.midHeight).toBeLessThan(closing.openHeight);
  expect(closing.midHeight).toBeGreaterThan(opening.closedHeight);
  expect(closing.midOpacity).toBeGreaterThan(0);
  expect(closing.midOpacity).toBeLessThan(1);
  await expect(details).not.toHaveAttribute("open");
  await expect(details).not.toHaveAttribute("data-disclosure-state");

  await details.evaluate((element) => {
    const summary = element.querySelector("summary")!;
    summary.click();
    summary.click();
    summary.click();
    element.getAnimations().forEach((animation) => animation.finish());
  });
  await expect(details).toHaveAttribute("open", "");
  await expect(details).not.toHaveAttribute("data-disclosure-state");
  await details.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(details).not.toHaveAttribute("open");
  await expect(details.locator("summary")).toBeFocused();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.keyboard.press("Space");
  await expect(details).toHaveAttribute("open", "");
  await expect(details).not.toHaveAttribute("data-disclosure-state");
  expect(await details.evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
});
}

test("content and native disclosures remain usable without JavaScript", async ({ browser, baseURL }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false);
    const details = page.locator("#volcano-app-details");
    await details.locator("summary").click();
    await expect(details).toHaveAttribute("open", "");
    await expect(details.getByRole("heading", { name: "My contribution" })).toBeVisible();
    const archive = page.locator("#smart-kids-academy-details");
    await archive.locator("summary").click();
    await expect(archive).toHaveAttribute("open", "");
    await expect(archive.locator(".archive-copy")).toBeVisible();
    await archive.locator("summary").click();
    await expect(archive).not.toHaveAttribute("open");
    await page.getByRole("navigation").getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/#contact$/);
  } finally {
    await context.close();
  }
});
