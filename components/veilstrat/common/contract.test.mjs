import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import app from "../veilstrat.app.mjs";

const require = createRequire(import.meta.url);
const axios = require("axios");
const COMPANY_ID = "4066c846-48ea-403a-97b1-fd60503fdb97";
const CASES = [
  [
    "search-companies-page",
    "POST",
    "/companies",
    {
      signalQuery: "signal:hiring:30d",
      countries: [
        "us",
        "US",
      ],
      page: 1,
      pageSize: 10,
    },
  ],
  [
    "get-company",
    "GET",
    `/companies/${COMPANY_ID}`,
    {
      companyId: COMPANY_ID,
    },
  ],
  [
    "search-signal-slices",
    "GET",
    "/slices",
    {
      slice: "ai-sdr-hiring",
      scoreMin: 0,
    },
  ],
  [
    "get-filter-catalog",
    "GET",
    "/filters",
    {},
  ],
  [
    "get-account-usage",
    "GET",
    "/stats",
    {},
  ],
  [
    "check-api-connection",
    "GET",
    "/health",
    {},
  ],
];

function instance() {
  const bound = {
    $auth: {
      api_key: "test-only-token",
    },
  };
  for (const [
    name,
    method,
  ] of Object.entries(app.methods)) bound[name] = method.bind(bound);
  return bound;
}

for (const [
  slug,
  method,
  path,
  values,
] of CASES) {
  test(`${slug} uses the real platform HTTP client and returns its JSON envelope`, async () => {
    let calls = 0;
    const envelope = {
      data: [
        {
          id: COMPANY_ID,
        },
      ],
      pagination: {
        page: 1,
        totalPages: 4,
      },
    };
    const original = axios.defaults.adapter;
    axios.defaults.adapter = async (config) => {
      calls++;
      assert.equal(config.url, `https://app.veilstrat.com/api/v1${path}`);
      assert.equal(config.method.toUpperCase(), method);
      assert.equal(config.headers.Authorization, "Bearer test-only-token");
      assert.equal(config.maxRedirects, 0);
      assert.equal(config.timeout, 20000);
      if (method === "POST") assert.deepEqual(JSON.parse(config.data), {
        signal_query: "signal:hiring:30d",
        countries: [
          "US",
        ],
        page: 1,
        pageSize: 10,
      });
      if (path === "/slices") assert.deepEqual(config.params, {
        slice: "ai-sdr-hiring",
        scoreMin: 0,
      });
      return {
        data: envelope,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };
    try {
      const action = (await import(`../actions/${slug}/${slug}.mjs`)).default;
      const summaries = [];
      const result = await action.run.call({
        app: instance(),
        ...values,
      }, {
        $: {
          export: (...args) => summaries.push(args),
        },
      });
      assert.deepEqual(result, envelope);
      assert.equal(calls, 1);
      assert.equal(summaries.length, 1);
      assert.equal(summaries[0][0], "$summary");
      assert.equal(action.version, "0.0.1");
      assert.equal(action.ai, "optimized");
      assert.deepEqual(action.annotations, {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: true,
      });
    } finally { axios.defaults.adapter = original; }
  });
}

test("invalid input is rejected before any request", async () => {
  const bound = instance();
  const original = axios.defaults.adapter;
  let calls = 0;
  axios.defaults.adapter = async () => { calls++; throw new Error("unexpected request"); };
  try {
    const invalid = [
      () => bound.searchCompanies({
        signalQuery: "",
        page: 1,
        pageSize: 10,
      }),
      () => bound.searchCompanies({
        signalQuery: "signal:hiring:30d",
        page: 11,
        pageSize: 50,
      }),
      () => bound.searchCompanies({
        signalQuery: "signal:hiring:30d",
        page: 1,
        pageSize: 51,
      }),
      () => bound.searchCompanies({
        signalQuery: "signal:hiring:30d",
        countries: [
          "USA",
        ],
      }),
      () => bound.getCompany({
        companyId: "https://outside.example/",
      }),
      () => bound.searchSlices({
        slice: "ai-sdr-hiring",
      }),
      () => bound.searchSlices({
        slice: "ai-sdr-hiring",
        scoreMin: 101,
      }),
      () => bound._makeRequest({
        path: "https://outside.example/",
      }),
    ];
    for (const run of invalid) await assert.rejects(async () => run());
    assert.equal(calls, 0);
  } finally { axios.defaults.adapter = original; }
});

test("HTTP failures never export credentials, request configuration or raw bodies", async () => {
  const original = axios.defaults.adapter;
  const exported = [];
  try {
    for (const status of [
      301,
      401,
      403,
      404,
      422,
      429,
      500,
    ]) {
      let calls = 0;
      axios.defaults.adapter = async (config) => {
        calls++;
        return {
          data: {
            message: "test-only-token private error body",
          },
          status,
          statusText: "Error",
          headers: {},
          config,
        };
      };
      await assert.rejects(instance().getUsage({
        $: {
          export: (...args) => exported.push(args),
        },
      }), (error) => {
        assert.equal(error.status, status);
        assert.match(error.message, new RegExp(`HTTP ${status}`));
        assert.doesNotMatch(JSON.stringify(error), /test-only-token|private error body|Authorization/);
        return true;
      });
      assert.equal(calls, 1);
    }
    assert.deepEqual(exported, []);
  } finally { axios.defaults.adapter = original; }
});

test("transport failures do not expose credential-bearing errors or retry", async () => {
  const original = axios.defaults.adapter;
  let calls = 0;
  axios.defaults.adapter = async () => { calls++; throw new Error("test-only-token connection failure"); };
  try {
    await assert.rejects(instance().getHealth({}), /could not be reached/);
    assert.equal(calls, 1);
  } finally { axios.defaults.adapter = original; }
});

test("legacy companies envelope is retained and the final legal page is bounded", async () => {
  const original = axios.defaults.adapter;
  const envelope = {
    companies: [
      {
        id: COMPANY_ID,
      },
    ],
    page: 10,
    pageSize: 50,
    total: 500,
    totalPages: 10,
  };
  axios.defaults.adapter = async (config) => {
    assert.equal(JSON.parse(config.data).page, 10);
    return {
      data: envelope,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
  try { assert.deepEqual(await instance().searchCompanies({
    signalQuery: "signal:hiring:30d",
    page: 10,
    pageSize: 50,
  }), envelope); }
  finally { axios.defaults.adapter = original; }
});
