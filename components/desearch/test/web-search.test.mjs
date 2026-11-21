import assert from "node:assert/strict";
import test from "node:test";
import { loadAction } from "./harness.mjs";

test("sends only query even with a stale count input and preserves the response", async () => {
  const response = { data: [{ title: "Example", link: "https://example.org", snippet: "Description" }] };
  const calls = [];
  const { action, app } = await loadAction(async ($, config) => {
    calls.push({ $, config });
    return response;
  });
  assert.equal(Object.hasOwn(action.props, "num"), false);
  const summaries = [];
  const $ = { export: (...args) => summaries.push(args) };
  const result = await action.run.call({ desearch: app, query: "a & b", num: 3 }, { $ });
  assert.equal(result, response);
  assert.deepEqual(calls, [{ $, config: {
    baseURL: "https://api.desearch.ai",
    headers: { Authorization: "Bearer mock-api-key" },
    method: "GET",
    url: "/web",
    params: { query: "a & b" },
  } }]);
  assert.deepEqual(summaries, [["$summary", "Retrieved 1 search results"]]);
});

test("empty results are supported with only the required query", async () => {
  const { action, app } = await loadAction(async (_, config) => {
    assert.equal(config.params.num, undefined);
    return { data: [] };
  });
  let summary;
  const result = await action.run.call({ desearch: app, query: "empty" }, {
    $: { export: (_, value) => { summary = value; } },
  });
  assert.deepEqual(result, { data: [] });
  assert.equal(summary, "Retrieved 0 search results");
});

test("HTTP errors propagate without a success summary or retry", async () => {
  const error = new Error("HTTP 401");
  let calls = 0;
  const { action, app } = await loadAction(async () => { calls++; throw error; });
  await assert.rejects(action.run.call({ desearch: app, query: "test" }, {
    $: { export: () => assert.fail("Unexpected summary") },
  }), (caught) => caught === error);
  assert.equal(calls, 1);
});
