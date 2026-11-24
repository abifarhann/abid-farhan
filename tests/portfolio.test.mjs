import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { portfolio } from "../src/data/portfolio.ts";

test("selected projects have unique anchors and complete detail sections", () => {
  assert.equal(portfolio.projects.length, 3);
  assert.equal(new Set(portfolio.projects.map((project) => project.id)).size, 3);
  for (const project of portfolio.projects) {
    assert.match(project.id, /^[a-z0-9-]+$/);
    for (const field of ["title", "category", "period", "problem", "contribution", "decision", "outcome"]) {
      assert.ok(project[field].trim(), `${project.id}: missing ${field}`);
    }
    assert.ok(project.stack.length > 0);
    assert.ok(project.imageAlt);
  }
});

test("contact URLs are empty or usable, never placeholder links", () => {
  for (const [key, value] of Object.entries(portfolio.contact)) {
    if (!value) continue;
    assert.notEqual(value, "#");
    if (key === "email") assert.match(value, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    else if (key === "phone") assert.match(value.replace(/[\s-]/g, ""), /^\+\d{10,15}$/);
    else if (key === "resume") assert.match(value, /^(\/|https:\/\/)/);
    else assert.equal(new URL(value).protocol, "https:");
  }
});

test("public site origin is unset or a real HTTPS origin", () => {
  if (!portfolio.siteUrl) return;
  const url = new URL(portfolio.siteUrl);
  assert.equal(url.protocol, "https:");
  assert.equal(url.pathname, "/");
  assert.equal(url.search, "");
  assert.equal(url.hash, "");
  assert.equal(url.username, "");
  assert.equal(url.password, "");
  assert.ok(!["localhost", "127.0.0.1", "example.com", "example.org"].includes(url.hostname));
});

test("experience and technical skill groups are complete", () => {
  assert.deepEqual(portfolio.experience.map((job) => job.company), ["CV DB Klik", "PT. Sinergi Dimensi Informatika", "PT. Travelana Mandiri Sejahtera"]);
  for (const job of portfolio.experience) {
    assert.ok(job.contributions.length >= 2 && job.contributions.length <= 3);
    assert.ok(job.period);
    assert.ok(job.stack.length > 0);
  }
  assert.equal(portfolio.skills.length, 4);
});

test("current CV, publication, and additional projects are connected", () => {
  const pdf = readFileSync(new URL(`../public${portfolio.contact.resume}`, import.meta.url));
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.equal(portfolio.contact.linkedin, "https://www.linkedin.com/in/abid-farhan/");
  assert.equal(portfolio.additionalProjects.length, 3);
  const ids = [...portfolio.projects, ...portfolio.additionalProjects].map((project) => project.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(portfolio.publication.url, `https://doi.org/${portfolio.publication.doi}`);
  assert.match(portfolio.projects[1].outcome, /200\+ merged pull requests/);
  assert.match(portfolio.certifications[1].detail, /^Expired /);
});
