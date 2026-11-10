import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { test } from "node:test";
import app from "../tavily.app.mjs";
import search from "../actions/send-query/send-query.mjs";
import extract from "../actions/extract/extract.mjs";

async function fixture(t, response, status = 200) {
  const requests = [];
  const server = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) {
      body += chunk;
    }
    requests.push({
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: JSON.parse(body),
    });
    res.writeHead(status, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(response));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => {
    server.close(resolve);
    server.closeAllConnections();
  }));
  const client = {
    ...app.methods,
    $auth: {
      api_key: "tvly-test-key",
    },
    _baseUrl: () => `http://127.0.0.1:${server.address().port}`,
  };
  const exports = {};
  const $ = {
    export: (name, value) => {
      exports[name] = value;
    },
  };
  return {
    requests,
    client,
    exports,
    run: (action, props = {}) => action.run.call({
      app: client,
      ...props,
    }, {
      $,
    }),
  };
}

test("legacy Search inputs retain their wire types and authenticate only in the header", async (t) => {
  const response = {
    results: [],
    request_id: "search-request",
  };
  const f = await fixture(t, response);
  const result = await f.run(search, {
    query: "Tavily",
    searchDepth: "basic",
    includeImages: false,
    includeAnswer: false,
    maxResults: 0,
  });
  const [
    request,
  ] = f.requests;
  assert.equal(request.method, "POST");
  assert.equal(request.url, "/search");
  assert.equal(request.headers.authorization, "Bearer tvly-test-key");
  assert.equal(request.headers["content-type"], "application/json");
  assert.deepEqual(request.body, {
    query: "Tavily",
    search_depth: "basic",
    include_images: false,
    include_answer: false,
    max_results: 0,
  });
  assert.deepEqual(result, response);
  assert.equal(f.exports.$summary, "Successfully retrieved 0 search results");
});

test("unset Search options leave server defaults intact for all search depths", async (t) => {
  const f = await fixture(t, {
    results: [],
  });
  await f.run(search, {
    query: "Tavily",
  });
  assert.deepEqual(f.requests[0].body, {
    query: "Tavily",
  });
  for (const depth of app.propDefinitions.searchDepth.options) {
    await f.run(search, {
      query: "Tavily",
      searchDepth: depth,
    });
    assert.equal(f.requests.at(-1).body.search_depth, depth);
  }
});

test("Search sends current controls using API parameter names", async (t) => {
  const f = await fixture(t, {
    results: [],
  });
  await f.run(search, {
    query: "Tavily",
    searchDepth: "advanced",
    maxResults: 20,
    chunksPerSource: 3,
    topic: "general",
    timeRange: "week",
    startDate: "2026-01-01",
    endDate: "2026-09-08",
    includeDomains: [
      "tavily.com",
    ],
    excludeDomains: [
      "example.com",
    ],
    includeDomainsMode: "boost",
    includeImages: true,
    includeImageDescriptions: true,
    includeFavicon: true,
    includeAnswer: true,
    answerDepth: "advanced",
    includeRawContent: true,
    rawContentFormat: "text",
    country: "united states",
    language: "en",
    filterByLanguage: true,
    autoParameters: true,
    exactMatch: true,
    safeSearch: true,
    includeUsage: true,
  });
  assert.deepEqual(f.requests[0].body, {
    query: "Tavily",
    search_depth: "advanced",
    max_results: 20,
    chunks_per_source: 3,
    topic: "general",
    time_range: "week",
    start_date: "2026-01-01",
    end_date: "2026-09-08",
    include_domains: [
      "tavily.com",
    ],
    exclude_domains: [
      "example.com",
    ],
    include_domains_mode: "boost",
    include_images: true,
    include_image_descriptions: true,
    include_favicon: true,
    include_answer: "advanced",
    include_raw_content: "text",
    country: "united states",
    language: "en",
    filter_by_language: true,
    auto_parameters: true,
    exact_match: true,
    safe_search: true,
    include_usage: true,
  });
});

test("answer and content detail settings never override disabled booleans", async (t) => {
  const f = await fixture(t, {
    results: [],
  });
  await f.run(search, {
    query: "Tavily",
    includeAnswer: false,
    answerDepth: "advanced",
    includeRawContent: false,
    rawContentFormat: "text",
  });
  assert.equal(f.requests[0].body.include_answer, false);
  assert.equal(f.requests[0].body.include_raw_content, false);
  await f.run(search, {
    query: "Tavily",
    includeAnswer: true,
    includeRawContent: true,
  });
  assert.equal(f.requests[1].body.include_answer, true);
  assert.equal(f.requests[1].body.include_raw_content, true);
});

test("Extract sends decimal timeouts and preserves partial failures and metadata", async (t) => {
  const response = {
    results: [
      {
        url: "https://tavily.com",
        raw_content: "Tavily",
      },
    ],
    failed_results: [
      {
        url: "https://example.com/missing",
        error: "Not found",
      },
    ],
    request_id: "extract-request",
    usage: {
      credits: 1,
    },
  };
  const f = await fixture(t, response);
  const urls = [
    "https://tavily.com",
    "https://example.com/missing",
  ];
  const result = await f.run(extract, {
    urls,
    extractDepth: "advanced",
    query: "API authentication",
    chunksPerSource: 5,
    format: "markdown",
    includeImages: false,
    includeFavicon: true,
    includeUsage: true,
    timeout: "2.5",
  });
  const [
    request,
  ] = f.requests;
  assert.equal(request.method, "POST");
  assert.equal(request.url, "/extract");
  assert.equal(request.headers.authorization, "Bearer tvly-test-key");
  assert.deepEqual(request.body, {
    urls,
    extract_depth: "advanced",
    query: "API authentication",
    chunks_per_source: 5,
    format: "markdown",
    include_images: false,
    include_favicon: true,
    include_usage: true,
    timeout: 2.5,
  });
  assert.deepEqual(result, response);
  assert.equal(f.exports.$summary, "Extracted content from 1 URLs; 1 failed");
});

test("Extract preserves API defaults and reports when every URL fails", async (t) => {
  const response = {
    results: [],
    failed_results: [
      {
        url: "https://example.com/missing",
        error: "Not found",
      },
    ],
  };
  const f = await fixture(t, response);
  assert.deepEqual(await f.run(extract, {
    urls: [
      "https://example.com/missing",
    ],
  }), response);
  assert.deepEqual(f.requests[0].body, {
    urls: [
      "https://example.com/missing",
    ],
  });
  assert.equal(f.exports.$summary, "Extracted content from 0 URLs; 1 failed");
});

test("invalid configurations fail before making a billable API request", async (t) => {
  const f = await fixture(t, {});
  const invalidSearch = [
    {
      maxResults: 21,
    },
    {
      maxResults: -1,
    },
    {
      maxResults: 1.5,
    },
    {
      chunksPerSource: 4,
    },
    {
      includeDomains: Array(301).fill("example.com"),
    },
    {
      excludeDomains: Array(151).fill("example.com"),
    },
    {
      includeDomainsMode: "boost",
    },
    {
      filterByLanguage: true,
    },
    {
      safeSearch: true,
      searchDepth: "fast",
    },
    {
      safeSearch: true,
      searchDepth: "ultra-fast",
    },
  ];
  for (const props of invalidSearch) {
    await assert.rejects(() => f.run(search, {
      query: "Tavily",
      ...props,
    }), /must|requires/);
  }
  const invalidExtract = [
    {
      urls: [],
    },
    {
      urls: Array(21).fill("https://example.com"),
    },
    {
      urls: [
        "",
      ],
    },
    {
      chunksPerSource: 6,
    },
    {
      timeout: "0",
    },
    {
      timeout: "61",
    },
    {
      timeout: "invalid",
    },
    {
      timeout: "Infinity",
    },
  ];
  for (const props of invalidExtract) {
    await assert.rejects(() => f.run(extract, {
      urls: [
        "https://example.com",
      ],
      ...props,
    }), /must/);
  }
  assert.equal(f.requests.length, 0);
});

test("upstream errors propagate instead of producing a successful summary", async (t) => {
  for (const status of [
    401,
    429,
    500,
  ]) {
    const f = await fixture(t, {
      detail: "Request failed",
    }, status);
    for (const action of [
      search,
      extract,
    ]) {
      await assert.rejects(() => f.run(action, {
        query: "Tavily",
        urls: [
          "https://example.com",
        ],
      }), (error) => error.response?.status === status);
    }
    assert.equal(f.exports.$summary, undefined);
  }
});
