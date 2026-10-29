import assert from "node:assert/strict";
import {
  before, mock, test,
} from "node:test";

class ConfigurationError extends Error {}

const requests = [];
let apiResponse;
let apiError;
mock.module("@pipedream/platform", {
  namedExports: {
    ConfigurationError,
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

const ACTIONS = [
  "web-search",
  "news-search",
  "image-search",
  "video-search",
  "shopping-search",
  "scholar-search",
  "patent-search",
  "autocomplete",
  "maps-search",
  "get-place",
  "fetch-webpage",
  "extract-pages",
  "map-site",
  "answer-question",
  "ask-chatgpt",
  "ask-gemini",
  "ask-copilot",
  "ask-ai-mode",
  "ask-brave-ai",
  "start-crawl",
  "get-crawl",
  "start-research",
  "get-research",
];

let app;
const actions = {};
before(async () => {
  ({ default: app } = await import("../serpkite.app.mjs"));
  for (const name of ACTIONS) {
    ({ default: actions[name] } = await import(`../actions/${name}/${name}.mjs`));
  }
});

const makeApp = () => ({
  ...app.methods,
  $auth: {
    api_key: "skt_live_test",
  },
});

const run = async (name, props) => {
  const summaries = [];
  const $ = {
    export: (...args) => summaries.push(args),
  };
  const result = await actions[name].run.call({
    app: makeApp(),
    ...props,
  }, {
    $,
  });
  return {
    result,
    summaries,
    $,
    config: requests.at(-1).config,
  };
};

test("every action has a unique serpkite key, a semver version and a documentation link", () => {
  const keys = new Set();
  for (const name of ACTIONS) {
    const action = actions[name];
    assert.equal(action.key, `serpkite-${name}`);
    assert.match(action.version, /^\d+\.\d+\.\d+$/);
    assert.match(action.description, /\[See the documentation\]\(https:\/\/serpkite\.com\/docs\/endpoints\/[a-z_]+\)$/);
    assert.ok(!keys.has(action.key));
    keys.add(action.key);
  }
});

test("search verticals POST a JSON body with Bearer auth and drop unset fields", async () => {
  for (const [
    name,
    endpoint,
  ] of [
      [
        "web-search",
        "search",
      ],
      [
        "news-search",
        "news",
      ],
      [
        "image-search",
        "images",
      ],
      [
        "video-search",
        "videos",
      ],
      [
        "shopping-search",
        "shopping",
      ],
      [
        "scholar-search",
        "scholar",
      ],
      [
        "patent-search",
        "patents",
      ],
      [
        "autocomplete",
        "autocomplete",
      ],
      [
        "maps-search",
        "maps",
      ],
    ]) {
    apiResponse = {
      results: [
        {
          title: "Example",
        },
      ],
      meta: {
        credits_used: 1,
      },
    };
    const {
      result, summaries, $, config,
    } = await run(name, {
      q: "test query",
      country: "gb",
      language: "",
      includeDomains: [],
    });
    assert.equal(result, apiResponse);
    assert.deepEqual(summaries, [
      [
        "$summary",
        "Retrieved 1 results",
      ],
    ]);
    assert.equal(requests.at(-1).$, $);
    assert.equal(config.url, `https://api.serpkite.com/v1/${endpoint}`);
    assert.equal(config.method, "POST");
    assert.equal(config.headers.Authorization, "Bearer skt_live_test");
    assert.deepEqual(config.data, {
      q: "test query",
      country: "gb",
    });
    assert.equal(config.params, undefined);
  }
});

test("web search maps camelCase props to API fields", async () => {
  apiResponse = {
    results: [],
  };
  const {
    config, summaries,
  } = await run("web-search", {
    q: "q",
    num: 20,
    page: 1,
    time: "week",
    location: "Austin, Texas, United States",
    includeDomains: [
      "example.com",
    ],
    excludeDomains: [
      ".gov",
    ],
    includeAnswer: true,
  });
  assert.deepEqual(config.data, {
    q: "q",
    location: "Austin, Texas, United States",
    num: 20,
    page: 1,
    time: "week",
    include_domains: [
      "example.com",
    ],
    exclude_domains: [
      ".gov",
    ],
    include_answer: true,
  });
  assert.deepEqual(summaries, [
    [
      "$summary",
      "Retrieved 0 results",
    ],
  ]);
});

test("assistants POST the prompt to their endpoint with a 120 s timeout", async () => {
  for (const [
    name,
    endpoint,
    label,
  ] of [
      [
        "ask-chatgpt",
        "chatgpt",
        "ChatGPT",
      ],
      [
        "ask-gemini",
        "gemini",
        "Gemini",
      ],
      [
        "ask-copilot",
        "copilot",
        "Copilot Search",
      ],
      [
        "ask-ai-mode",
        "ai_mode",
        "Google AI Mode",
      ],
      [
        "ask-brave-ai",
        "brave_ai",
        "Brave AI",
      ],
    ]) {
    apiResponse = {
      text: "An answer",
      markdown: "An answer",
      sources: [
        {
          link: "https://example.com",
        },
      ],
    };
    const {
      result, summaries, config,
    } = await run(name, {
      prompt: "best crm",
      country: "us",
      track: [
        "hubspot.com",
      ],
    });
    assert.equal(result, apiResponse);
    assert.equal(config.url, `https://api.serpkite.com/v1/${endpoint}`);
    assert.equal(config.method, "POST");
    assert.equal(config.timeout, 120000);
    assert.deepEqual(config.data, {
      prompt: "best crm",
      country: "us",
      track: [
        "hubspot.com",
      ],
    });
    assert.deepEqual(summaries, [
      [
        "$summary",
        `${label} answered with 1 sources`,
      ],
    ]);
  }
});

test("ChatGPT sends web_search, and an empty answer says it was not billed", async () => {
  apiResponse = {
    text: "",
    markdown: "",
    sources: [],
  };
  const {
    config, summaries,
  } = await run("ask-chatgpt", {
    prompt: "p",
    webSearch: false,
  });
  assert.deepEqual(config.data, {
    prompt: "p",
    web_search: false,
  });
  assert.deepEqual(summaries, [
    [
      "$summary",
      "ChatGPT returned no answer (not billed)",
    ],
  ]);
});

test("extract parses the output schema, and invalid JSON fails before a request", async () => {
  apiResponse = {
    results: [
      {},
    ],
    failed: [],
  };
  const { config } = await run("extract-pages", {
    urls: [
      "https://example.com",
    ],
    outputSchema: "{\"type\":\"object\"}",
    maxTokens: 500,
  });
  assert.equal(config.url, "https://api.serpkite.com/v1/extract");
  assert.deepEqual(config.data, {
    urls: [
      "https://example.com",
    ],
    max_tokens: 500,
    output_schema: {
      type: "object",
    },
  });
  const before = requests.length;
  await assert.rejects(run("extract-pages", {
    urls: [
      "https://example.com",
    ],
    outputSchema: "{not json",
  }), ConfigurationError);
  assert.equal(requests.length, before);
});

test("get place needs a place id or cid", async () => {
  const before = requests.length;
  await assert.rejects(run("get-place", {}), ConfigurationError);
  assert.equal(requests.length, before);
  apiResponse = {
    place: {
      title: "Cafe",
    },
  };
  const {
    config, summaries,
  } = await run("get-place", {
    placeId: "ChIJ123",
  });
  assert.deepEqual(config.data, {
    place_id: "ChIJ123",
  });
  assert.deepEqual(summaries, [
    [
      "$summary",
      "Retrieved Cafe",
    ],
  ]);
});

test("crawl and research start with POST and are read back with GET", async () => {
  apiResponse = {
    id: "task-1",
    status: "queued",
  };
  let { config } = await run("start-crawl", {
    url: "https://example.com",
    limit: 5,
    maxDepth: 1,
    includePaths: [
      "^/docs/",
    ],
  });
  assert.equal(config.url, "https://api.serpkite.com/v1/crawl");
  assert.deepEqual(config.data, {
    url: "https://example.com",
    limit: 5,
    max_depth: 1,
    include_paths: [
      "^/docs/",
    ],
  });
  ({ config } = await run("get-crawl", {
    taskId: "task-1",
  }));
  assert.equal(config.method, "GET");
  assert.equal(config.url, "https://api.serpkite.com/v1/crawl/task-1");
  ({ config } = await run("start-research", {
    input: "compare vector databases",
    effort: "lite",
  }));
  assert.equal(config.url, "https://api.serpkite.com/v1/research");
  assert.deepEqual(config.data, {
    input: "compare vector databases",
    effort: "lite",
  });
  ({ config } = await run("get-research", {
    taskId: "task-1",
  }));
  assert.equal(config.method, "GET");
  assert.equal(config.url, "https://api.serpkite.com/v1/research/task-1");
});

test("upstream errors propagate without exporting a success summary", async () => {
  for (const name of [
    "web-search",
    "fetch-webpage",
    "ask-chatgpt",
  ]) {
    apiError = new Error("HTTP 402 insufficient_credits");
    const summaries = [];
    await assert.rejects(actions[name].run.call({
      app: makeApp(),
      q: "test",
      url: "https://example.com",
      prompt: "test",
    }, {
      $: {
        export: (...args) => summaries.push(args),
      },
    }), apiError);
    assert.deepEqual(summaries, []);
    apiError = undefined;
  }
});
