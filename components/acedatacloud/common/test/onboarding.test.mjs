import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const root = new URL("../../", import.meta.url);
const topFive = [
  [
    "suno-generate-music",
    /suno/i,
  ],
  [
    "seedance-generate-video",
    /seedance/i,
  ],
  [
    "happyhorse-generate-video",
    /happy\s?horse/i,
  ],
  [
    "gpt-image-generate",
    /gpt image/i,
  ],
  [
    "nano-banana-generate",
    /nano banana/i,
  ],
];

test("service-specific action identity and onboarding keep approved attribution fields", async () => {
  for (const [
    slug,
    service,
  ] of topFive) {
    const { default: action } = await import(new URL(`actions/${slug}/${slug}.mjs`, root));
    assert.match(action.name, service);
    assert.match(action.description, /through Ace Data Cloud/);
    assert.doesNotMatch(action.name, /AceDataCloud|Ace Data Cloud/);
    const readme = await readFile(new URL(`actions/${slug}/README.md`, root), "utf8");
    assert.match(readme, /General application/);
    assert.match(readme, /api_key/);
    assert.match(readme, /same.*task|same\*\* task/);
    for (const link of readme.matchAll(/https:\/\/platform\.acedata\.cloud\/[^\s)]+/g)) {
      const url = new URL(link[0]);
      assert.equal(url.searchParams.get("utm_source"), "opensource");
      assert.equal(url.searchParams.get("utm_medium"), "referral");
      assert.equal(url.searchParams.get("utm_campaign"), "evergreen");
      const content = url.searchParams.get("utm_content");
      assert.match(content, /^pipedream_[a-z0-9_]+$/);
      assert.ok(content.length <= 96);
    }
  }
});

test("bilingual onboarding identifies screenshots and current product lifecycle", async () => {
  for (const path of [
    "README.md",
    "common/tutorial/README_zh_Hans.md",
  ]) {
    const text = await readFile(new URL(path, root), "utf8");
    assert.match(text, /2027-03-31|March 31, 2027/);
    assert.match(text, /Connect/);
    assert.match(text, /get-api-key-en\.png/);
    assert.match(text, /create-api-key-en\.png/);
    assert.match(text, /Dify tutorial/);
    assert.match(text, /api_key/);
  }
  const sources = JSON.parse(await readFile(new URL("common/tutorial/sources.json", root), "utf8"));
  assert.equal(sources.images.length, 3);
  for (const source of sources.images) {
    assert.ok(source.source_url.startsWith("https://"));
    assert.equal(source.capture_date, null);
  }
});
