import assert from "node:assert/strict";
import {
  before, mock, test,
} from "node:test";

const requests = [];
let apiResponse;
let apiError;
mock.module("@pipedream/platform", {
  namedExports: {
    axios: async ($, config) => {
      requests.push({
        $,
        config,
      });
      if (apiError) throw apiError;
      return apiResponse;
    },
  },
});

let app;
let search;
let news;
let webpage;
before(async () => {
  ({ default: app } = await import("../serpkite.app.mjs"));
  ({ default: search } = await import("../actions/web-search/web-search.mjs"));
  ({ default: news } = await import("../actions/news-search/news-search.mjs"));
  ({ default: webpage } = await import("../actions/fetch-webpage/fetch-webpage.mjs"));
});

const makeApp = () => ({
  ...app.methods,
  $auth: {
    api_key: "skt_live_test",
  },
});

test("web and news search use Bearer auth, preserve the full envelope, and forward localization", async () => {
  for (const [
    action,
    endpoint,
  ] of [
      [
        search,
        "search",
      ],
      [
        news,
        "news",
      ],
    ]) {
    apiResponse = {
      results: [
        {
          title: "Example",
          link: "https://example.com",
        },
      ],
      meta: {
        credits: 1,
      },
    };
    const summaries = [];
    const $ = {
      export: (...args) => summaries.push(args),
    };
    const result = await action.run.call({
      app: makeApp(),
      q: "test query",
      country: "gb",
      language: "en",
      num: 20,
      time: "week",
    }, {
      $,
    });
    assert.equal(result, apiResponse);
    assert.deepEqual(summaries, [
      [
        "$summary",
        "Retrieved 1 results",
      ],
    ]);
    const request = requests.at(-1);
    assert.equal(request.$, $);
    assert.equal(request.config.url, `https://api.serpkite.com/v1/${endpoint}`);
    assert.equal(request.config.method, "GET");
    assert.equal(request.config.headers.Authorization, "Bearer skt_live_test");
    assert.deepEqual(request.config.params, {
      q: "test query",
      country: "gb",
      language: "en",
      num: 20,
      time: "week",
    });
    assert.equal(request.config.params.api_key, undefined);
  }
});

test("empty successful results return the envelope and a zero summary", async () => {
  apiResponse = {
    results: [],
    meta: {
      credits: 0,
    },
  };
  const summaries = [];
  const result = await search.run.call({
    app: makeApp(),
    q: "test",
  }, {
    $: {
      export: (...args) => summaries.push(args),
    },
  });
  assert.equal(result, apiResponse);
  assert.deepEqual(summaries, [
    [
      "$summary",
      "Retrieved 0 results",
    ],
  ]);
});

test("webpage POST uses a JSON body and preserves Markdown metadata", async () => {
  apiResponse = {
    content: "# Example",
    title: "Example",
    meta: {
      credits: 1,
    },
  };
  const result = await webpage.run.call({
    app: makeApp(),
    url: "https://example.com/a?b=c",
  }, {
    $: {
      export: () => {},
    },
  });
  assert.equal(result, apiResponse);
  const { config } = requests.at(-1);
  assert.equal(config.url, "https://api.serpkite.com/v1/webpage");
  assert.equal(config.method, "POST");
  assert.deepEqual(config.data, {
    url: "https://example.com/a?b=c",
  });
  assert.equal(config.params, undefined);
});

test("upstream errors propagate without exporting a success summary", async () => {
  for (const action of [
    search,
    news,
    webpage,
  ]) {
    apiError = new Error("HTTP 402 insufficient_credits");
    const summaries = [];
    await assert.rejects(action.run.call({
      app: makeApp(),
      q: "test",
      url: "https://example.com",
    }, {
      $: {
        export: (...args) => summaries.push(args),
      },
    }), apiError);
    assert.deepEqual(summaries, []);
    apiError = undefined;
  }
});
