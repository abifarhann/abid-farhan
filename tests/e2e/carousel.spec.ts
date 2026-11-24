import { expect, test } from "@playwright/test";
import { geoEruptScreenshots } from "../../src/data/portfolio";

test("GeoErupt cycles in one preview and supports pause, focus, hover and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/");
  const carousel = page.locator(".project-carousel");
  const slides = carousel.locator(".carousel-slide");
  await expect(slides).toHaveCount(4);
  await expect(page.locator(".project-screenshots")).toHaveCount(0);
  for (let index = 0; index < 4; index++) {
    await expect(slides.nth(index).locator("img")).toHaveAttribute("alt", geoEruptScreenshots[index].alt);
  }
  await expect(slides.nth(0)).toHaveAttribute("aria-hidden", "false");
  await page.clock.runFor(4100);
  await expect(slides.nth(1)).toHaveAttribute("aria-hidden", "false");
  await carousel.hover();
  await page.clock.runFor(5000);
  await expect(slides.nth(1)).toHaveAttribute("aria-hidden", "false");
  await carousel.getByRole("button", { name: "Show preview 4" }).click();
  await expect(slides.nth(3)).toHaveAttribute("aria-hidden", "false");
  await carousel.getByRole("button", { name: "Pause slideshow" }).click();
  await page.mouse.move(0, 0);
  await carousel.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await page.clock.runFor(5000);
  await expect(slides.nth(3)).toHaveAttribute("aria-hidden", "false");
  await carousel.getByRole("button", { name: "Play slideshow" }).click();
  await page.mouse.move(0, 0);
  await page.clock.runFor(5000);
  await expect(slides.nth(3)).toHaveAttribute("aria-hidden", "false");
  await carousel.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await page.clock.runFor(4100);
  await expect(slides.nth(0)).toHaveAttribute("aria-hidden", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(carousel.getByRole("button", { name: "Pause slideshow" })).toHaveCount(0);
  await page.clock.runFor(5000);
  await expect(slides.nth(0)).toHaveAttribute("aria-hidden", "false");
  await expect(carousel.locator(".carousel-track")).toHaveCSS("transition-duration", "0s");
  await carousel.getByRole("button", { name: "Show preview 2" }).click();
  await expect(slides.nth(1)).toHaveAttribute("aria-hidden", "false");
});
