import { loadAction } from "./harness.mjs";

const apiKey = process.env.DESEARCH_API_KEY;
if (!apiKey) {
  console.error("DESEARCH_API_KEY is required");
  process.exit(1);
}
try {
  const { action, app } = await loadAction(async (_, config) => {
    const url = new URL(config.url, config.baseURL);
    for (const [key, value] of Object.entries(config.params)) {
      if (value !== undefined) url.searchParams.set(key, value);
    }
    const response = await fetch(url, {
      method: config.method,
      headers: config.headers,
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error("Search request failed");
    return response.json();
  }, apiKey);
  const response = await action.run.call({ desearch: app, query: "bittensor", num: 3 }, {
    $: { export() {} },
  });
  console.log(JSON.stringify({ count: response.data.length, firstTitle: response.data[0]?.title ?? null }));
} catch {
  // Never log request configuration, headers, or raw errors containing credentials.
  console.error("Live search failed");
  process.exitCode = 1;
}
