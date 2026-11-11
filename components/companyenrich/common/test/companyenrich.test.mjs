import assert from "node:assert/strict";
import {
  readFileSync, readdirSync,
} from "node:fs";
import {
  dirname, resolve,
} from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import vm from "node:vm";
import JSONBigInt from "json-bigint";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const API_KEY = "synthetic-companyenrich-test-key";
const COMPANY_ID = "123e4567-e89b-12d3-a456-426614174000";
const PERSON_ID = "9223372036854775807";
const BASE_URL = "https://api.companyenrich.com/v2";

class ConfigurationError extends Error {}

const plain = (value) => value === undefined
  ? undefined
  : JSON.parse(JSON.stringify(value));

// Only the transport is replaced. Relative imports use the shipped source, and the VM
// has no fetch, process, require, or dynamic import hook capable of reaching a network.
function harness({
  response = {
    items: [],
    nextCursor: "another-paid-page",
  }, error,
} = {}) {
  const calls = [];
  const summaries = [];
  const context = vm.createContext({
    URLSearchParams,
  });
  const modules = new Map();
  const platform = new vm.SyntheticModule([
    "axios",
    "ConfigurationError",
  ], function() {
    this.setExport("ConfigurationError", ConfigurationError);
    this.setExport("axios", async ($, config) => {
      calls.push({
        $,
        config,
      });
      if (error) {
        throw error;
      }
      return (config.transformResponse ?? []).reduce(
        (value, transform) => transform(value),
        response,
      );
    });
  }, {
    context,
  });
  const jsonBigInt = new vm.SyntheticModule([
    "default",
  ], function() {
    this.setExport("default", JSONBigInt);
  }, {
    context,
  });
  function getModule(filename) {
    if (!modules.has(filename)) {
      modules.set(filename, new vm.SourceTextModule(readFileSync(filename, "utf8"), {
        context,
        identifier: filename,
      }));
    }
    return modules.get(filename);
  }
  async function load(filename) {
    const module = getModule(filename);
    if (module.status === "unlinked") {
      await module.link((specifier, importingModule) => {
        if (specifier === "@pipedream/platform") {
          return platform;
        }
        if (specifier === "json-bigint") {
          return jsonBigInt;
        }
        assert.ok(specifier.startsWith("."), `Unexpected external import: ${specifier}`);
        const target = resolve(dirname(importingModule.identifier), specifier);
        assert.ok(target.startsWith(`${ROOT}/`));
        return getModule(target);
      });
    }
    if (module.status === "linked") {
      await module.evaluate();
    }
    return module.namespace.default;
  }
  const $ = {
    export: (name, value) => summaries.push({
      name,
      value,
    }),
  };
  async function appInstance() {
    const definition = await load(resolve(ROOT, "companyenrich.app.mjs"));
    return {
      ...definition.methods,
      $auth: {
        api_key: API_KEY,
      },
    };
  }
  return {
    calls,
    summaries,
    $,
    appInstance,
    async action(slug) {
      return load(resolve(ROOT, "actions", slug, `${slug}.mjs`));
    },
    async run(slug, inputs = {}) {
      const action = await this.action(slug);
      // Match JSON inputs arriving in the component's realm, including plain objects.
      const props = vm.runInContext(`JSON.parse(${JSON.stringify(JSON.stringify(inputs))})`, context);
      return action.run.call({
        ...props,
        companyenrich: await appInstance(),
      }, {
        $,
      });
    },
  };
}

// Fixed expectations transcribed from the public API v2 contracts. These are not
// inferred from the app's method names or from the action implementations.
const ROUTES = [
  {
    slug: "enrich-company",
    method: "GET",
    path: "/companies/enrich",
    input: {
      domain: "example.com",
      companyExpand: [
        "financial",
        "workforce",
      ],
      waitForEnrichment: false,
    },
    params: {
      domain: "example.com",
      expand: [
        "financial",
        "workforce",
      ],
      waitForEnrichment: false,
    },
  },
  {
    slug: "get-company",
    method: "GET",
    path: `/companies/${COMPANY_ID}`,
    input: {
      companyId: COMPANY_ID,
      companyExpand: [
        "keywords",
        "technologies",
      ],
    },
    params: {
      expand: [
        "keywords",
        "technologies",
      ],
    },
  },
  {
    slug: "enrich-company-by-properties",
    method: "POST",
    path: "/companies/enrich",
    input: {
      name: "Example",
      linkedinUrl: "https://linkedin.com/company/example",
      linkedinId: "123",
      twitterUrl: "https://x.com/example",
      facebookUrl: "https://facebook.com/example",
      instagramUrl: "https://instagram.com/example",
      youtubeUrl: "https://youtube.com/@example",
      companyExpand: [
        "naicsCodes",
      ],
    },
    data: {
      name: "Example",
      linkedinUrl: "https://linkedin.com/company/example",
      linkedinId: "123",
      twitterUrl: "https://x.com/example",
      facebookUrl: "https://facebook.com/example",
      instagramUrl: "https://instagram.com/example",
      youtubeUrl: "https://youtube.com/@example",
      expand: [
        "naicsCodes",
      ],
    },
  },
  {
    slug: "enrich-companies",
    method: "POST",
    path: "/companies/enrich/batch",
    input: {
      domains: [
        "example.com",
        "example.org",
        "example.com",
      ],
      companyExpand: [
        "financial",
      ],
      waitForEnrichment: false,
    },
    data: {
      domains: [
        "example.com",
        "example.org",
        "example.com",
      ],
      expand: [
        "financial",
      ],
      waitForEnrichment: false,
    },
  },
  {
    slug: "search-companies",
    method: "POST",
    path: "/companies/search",
    input: {
      companyFilter: "{\"country\":\"US\"}",
      semantic: "{\"query\":\"billing software\",\"weight\":0,\"autoFilter\":false}",
      pageSize: 2,
      cursor: "opaque+/=",
      companyExpand: [
        "technologies",
      ],
    },
    data: {
      filter: {
        country: "US",
      },
      semantic: {
        query: "billing software",
        weight: 0,
        autoFilter: false,
      },
      pageSize: 2,
      cursor: "opaque+/=",
      expand: [
        "technologies",
      ],
    },
  },
  {
    slug: "count-companies",
    method: "POST",
    path: "/companies/search/count",
    input: {
      companyFilter: "{\"country\":[\"US\",\"GB\"]}",
      lookalike: "{\"domains\":[\"example.com\"],\"weight\":-1,\"minScore\":0}",
    },
    data: {
      filter: {
        country: [
          "US",
          "GB",
        ],
      },
      lookalike: {
        domains: [
          "example.com",
        ],
        weight: -1,
        minScore: 0,
      },
    },
  },
  {
    slug: "preview-companies",
    method: "POST",
    path: "/companies/search/preview",
    input: {
      semantic: "{\"query\":\"billing\",\"autoFilter\":false}",
    },
    data: {
      semantic: {
        query: "billing",
        autoFilter: false,
      },
    },
  },
  {
    slug: "get-company-workforce",
    method: "GET",
    path: "/companies/workforce",
    input: {
      domain: "example.com",
      cursor: "history+/=",
    },
    params: {
      domain: "example.com",
      cursor: "history+/=",
    },
  },
  {
    slug: "autocomplete-companies",
    method: "GET",
    path: "/companies/autocomplete",
    input: {
      query: "exa",
    },
    params: {
      query: "exa",
    },
  },
  {
    slug: "search-people",
    method: "POST",
    path: "/people/search",
    input: {
      personFilter: "{\"position\":\"engineer\"}",
      companyQuery: "{\"filter\":{\"country\":\"US\"},\"lookalike\":{\"domains\":[\"example.com\"]}}",
      pageSize: 1,
      cursor: "people+/=",
      personExpand: [
        "education",
      ],
    },
    data: {
      filter: {
        position: "engineer",
      },
      company: {
        filter: {
          country: "US",
        },
        lookalike: {
          domains: [
            "example.com",
          ],
        },
      },
      pageSize: 1,
      cursor: "people+/=",
      expand: [
        "education",
      ],
    },
  },
  {
    slug: "count-people",
    method: "POST",
    path: "/people/search/count",
    input: {
      personFilter: "{\"domain\":\"example.com\"}",
      companyQuery: "{\"semantic\":{\"query\":\"billing\",\"weight\":0,\"autoFilter\":false}}",
    },
    data: {
      filter: {
        domain: "example.com",
      },
      company: {
        semantic: {
          query: "billing",
          weight: 0,
          autoFilter: false,
        },
      },
    },
  },
  {
    slug: "preview-people",
    method: "POST",
    path: "/people/search/preview",
    input: {
      personFilter: "{\"country\":[\"US\",\"GB\"]}",
    },
    data: {
      filter: {
        country: [
          "US",
          "GB",
        ],
      },
    },
  },
  {
    slug: "get-person",
    method: "GET",
    path: `/people/${PERSON_ID}`,
    input: {
      personId: PERSON_ID,
      personExpand: [
        "education",
      ],
    },
    params: {
      expand: [
        "education",
      ],
    },
  },
  {
    slug: "enrich-person",
    method: "POST",
    path: "/people/enrich",
    input: {
      email: "person@example.com",
      personExpand: [
        "education",
      ],
    },
    data: {
      email: "person@example.com",
      expand: [
        "education",
      ],
    },
  },
  {
    slug: "find-work-email",
    method: "GET",
    path: `/people/${PERSON_ID}/email`,
    input: {
      personId: PERSON_ID,
      domain: "example.com",
    },
    params: {
      domain: "example.com",
    },
  },
  {
    slug: "get-regions",
    method: "GET",
    path: "/geo/regions",
    input: {},
  },
  {
    slug: "get-country",
    method: "GET",
    path: "/geo/countries/gb",
    input: {
      countryCode: "gb",
    },
  },
  {
    slug: "search-countries",
    method: "POST",
    path: "/geo/countries",
    input: {
      query: "United",
      pageSize: 1,
      cursor: "countries+/=",
    },
    data: {
      query: "United",
      pageSize: 1,
      cursor: "countries+/=",
    },
  },
  {
    slug: "search-states",
    method: "POST",
    path: "/geo/states",
    input: {
      query: "New",
      countryCodes: [
        "US",
        "gb",
      ],
      pageSize: 2,
      cursor: "states+/=",
    },
    data: {
      query: "New",
      countryCodes: [
        "US",
        "gb",
      ],
      pageSize: 2,
      cursor: "states+/=",
    },
  },
  {
    slug: "search-cities",
    method: "POST",
    path: "/geo/cities",
    input: {
      query: "New",
      countryCodes: [
        "US",
      ],
      stateIds: [
        "1",
        "2147483647",
      ],
      pageSize: 2,
      cursor: "cities+/=",
    },
    data: {
      query: "New",
      countryCodes: [
        "US",
      ],
      stateIds: [
        1,
        2147483647,
      ],
      pageSize: 2,
      cursor: "cities+/=",
    },
  },
  {
    slug: "list-industries",
    method: "GET",
    path: "/industries",
    input: {},
  },
  {
    slug: "lookup-keywords",
    method: "GET",
    path: "/keywords/autocomplete",
    input: {
      query: "cloud",
    },
    params: {
      query: "cloud",
    },
  },
  {
    slug: "lookup-technologies",
    method: "GET",
    path: "/technologies/autocomplete",
    input: {
      query: "shop",
    },
    params: {
      query: "shop",
    },
  },
  {
    slug: "lookup-positions",
    method: "GET",
    path: "/positions/autocomplete",
    input: {
      query: "engineer",
    },
    params: {
      query: "engineer",
    },
  },
  {
    slug: "get-account",
    method: "GET",
    path: "/me",
    input: {},
  },
];

for (const fixture of ROUTES) {
  test(`${fixture.slug}: real action/app produces the documented request and preserves the full result`, async () => {
    const response = fixture.slug === "get-account"
      ? {
        userId: "user-1",
        credits: {
          used: 0,
          total: 20,
        },
        capabilities: {
          lists: false,
          previews: true,
          companySearchLimit: 0,
        },
      }
      : {
        items: [
          {
            id: "second",
            extra: {
              keep: true,
            },
          },
          {
            id: "first",
          },
        ],
        nextCursor: "next-paid-page",
        count: 0,
        total: 200,
        status: "pending",
        domain: "example.com",
        extra: {
          keep: "unchanged",
        },
      };
    const h = harness({
      response,
    });
    const result = await h.run(fixture.slug, fixture.input);
    assert.deepEqual(plain(result), response);
    assert.equal(h.calls.length, 1, "no automatic pagination or polling");
    const {
      $, config,
    } = h.calls[0];
    assert.equal($, h.$, "Pipedream execution context reaches axios");
    assert.equal(config.baseURL, BASE_URL);
    assert.equal(config.url, fixture.path);
    assert.equal(config.method, fixture.method);
    assert.deepEqual(plain(config.params), fixture.params);
    assert.deepEqual(plain(config.data), fixture.data);
    assert.deepEqual(plain(config.headers), {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
    });
    assert.equal(config.maxRedirects, 0, "the bearer token must not follow redirects");
    assert.ok(config.timeout > 0 && config.timeout <= 60000);
    assert.equal(h.summaries.length, 1);
    assert.equal(h.summaries[0].name, "$summary");
    assert.equal(typeof h.summaries[0].value, "string");
    assert.ok(h.summaries[0].value.length > 0);
    assert.ok(!JSON.stringify(h.summaries).includes(API_KEY));
  });
}

test("every shipped action has valid metadata and references real shared definitions", async () => {
  const dirs = readdirSync(resolve(ROOT, "actions"));
  assert.deepEqual(dirs.sort(), ROUTES.map(({ slug }) => slug).sort());
  const keys = new Set();
  const h = harness();
  for (const slug of dirs) {
    const action = await h.action(slug);
    assert.equal(action.key, `companyenrich-${slug}`);
    assert.ok(!keys.has(action.key));
    keys.add(action.key);
    assert.equal(action.version, "0.0.1");
    assert.equal(action.type, "action");
    assert.equal(action.ai, "optimized");
    assert.match(action.description, /https:\/\/docs\.companyenrich\.com\/reference\//);
    assert.equal(Object.keys(action.props)[0], "companyenrich");
    assert.equal(action.props.companyenrich.type, "app");
    assert.equal(action.props.companyenrich.app, "companyenrich");
    assert.deepEqual(plain(action.annotations), {
      readOnlyHint: ![
        "find-work-email",
        "enrich-company",
        "enrich-companies",
      ].includes(slug),
      destructiveHint: false,
      openWorldHint: true,
    });
    for (const prop of Object.values(action.props)) {
      if (prop.propDefinition) {
        const [
          app,
          name,
        ] = prop.propDefinition;
        assert.equal(app, action.props.companyenrich);
        assert.ok(app.propDefinitions[name], `${slug}: missing shared prop ${name}`);
      }
    }
  }
});

for (const slug of [
  "count-companies",
  "preview-companies",
  "count-people",
  "preview-people",
]) {
  test(`${slug}: hidden paging and paid expansion inputs never enter a request`, async () => {
    const h = harness({
      response: {
        items: [],
        count: 0,
        total: 5,
      },
    });
    await h.run(slug, {
      pageSize: 100,
      cursor: "should-not-forward",
      companyExpand: [
        "workforce",
      ],
      personExpand: [
        "education",
      ],
      expand: [
        "financial",
      ],
      page: 2,
      size: 10,
    });
    assert.deepEqual(plain(h.calls[0].config.data), {});
    assert.equal(h.calls.length, 1);
    const action = await h.action(slug);
    for (const field of [
      "pageSize",
      "cursor",
      "companyExpand",
      "personExpand",
    ]) {
      assert.ok(!(field in action.props));
    }
  });
}

for (const slug of [
  "search-companies",
  "search-people",
  "search-countries",
  "search-states",
  "search-cities",
]) {
  test(`${slug}: defaults to one ten-result page and omits optional inputs`, async () => {
    const h = harness();
    await h.run(slug);
    assert.deepEqual(plain(h.calls[0].config.data), {
      pageSize: 10,
    });
    assert.equal(h.calls.length, 1);
  });
}

for (const slug of [
  "autocomplete-companies",
  "lookup-keywords",
  "lookup-technologies",
  "lookup-positions",
]) {
  test(`${slug}: empty suggestion query remains an explicit empty string`, async () => {
    const h = harness();
    await h.run(slug, {
      query: "",
    });
    assert.deepEqual(plain(h.calls[0].config.params), {
      query: "",
    });
  });
}

test("GET serializer repeats expand keys and preserves encoded opaque cursor and false", async () => {
  const h = harness();
  await h.run("enrich-company", {
    domain: "example.com",
    companyExpand: [
      "financial",
      "workforce",
    ],
    waitForEnrichment: false,
  });
  const { config } = h.calls[0];
  assert.equal(config.paramsSerializer(config.params), "domain=example.com&expand=financial&expand=workforce&waitForEnrichment=false");
  assert.equal(config.paramsSerializer({
    cursor: "a+/= ?",
    empty: "",
    zero: 0,
    absent: undefined,
    nil: null,
  }), "cursor=a%2B%2F%3D+%3F&empty=&zero=0");
});

test("company search preserves advanced filter values and negative lookalike weights", async () => {
  const h = harness();
  const filter = {
    employees: {
      min: 0,
    },
    country: {
      in: [
        "US",
      ],
      notIn: [
        "GB",
      ],
    },
    b2b: false,
  };
  const lookalike = {
    domains: [
      "example.com",
    ],
    weight: -0.5,
    minScore: 0,
  };
  await h.run("search-companies", {
    companyFilter: filter,
    lookalike,
    pageSize: 100,
    companyExpand: [],
  });
  assert.deepEqual(plain(h.calls[0].config.data), {
    filter,
    lookalike,
    pageSize: 100,
    expand: [],
  });
});

test("people employer query remains nested under company, with person filters separate", async () => {
  const h = harness();
  await h.run("search-people", {
    personFilter: {
      seniority: "c_suite",
    },
    companyQuery: {
      filter: {
        country: "US",
      },
      semantic: {
        query: "billing",
        weight: 0,
        autoFilter: false,
      },
    },
  });
  assert.deepEqual(plain(h.calls[0].config.data), {
    filter: {
      seniority: "c_suite",
    },
    company: {
      filter: {
        country: "US",
      },
      semantic: {
        query: "billing",
        weight: 0,
        autoFilter: false,
      },
    },
    pageSize: 10,
  });
});

test("batch result states, duplicates, order, and pending responses are preserved without retries", async () => {
  const response = {
    items: [
      {
        domain: "example.com",
        status: "found",
        company: {
          id: COMPANY_ID,
        },
      },
      {
        domain: "missing.example",
        status: "not-found",
      },
      {
        domain: "invalid",
        status: "invalid-domain",
      },
      {
        domain: "pending.example",
        status: "pending",
      },
      {
        domain: "example.com",
        status: "found",
        company: {
          id: COMPANY_ID,
        },
      },
    ],
    extra: "keep",
  };
  const h = harness({
    response,
  });
  const result = await h.run("enrich-companies", {
    domains: response.items.map(({ domain }) => domain),
    waitForEnrichment: false,
  });
  assert.equal(result, response);
  assert.equal(h.calls.length, 1);
  assert.deepEqual(
    plain(h.calls[0].config.data.domains),
    response.items.map(({ domain }) => domain),
  );
});

test("batch accepts both documented bounds and defaults waitForEnrichment to true", async () => {
  for (const length of [
    1,
    50,
  ]) {
    const h = harness();
    await h.run("enrich-companies", {
      domains: Array.from({
        length,
      }, (_, i) => `example${i}.com`),
    });
    assert.equal(h.calls[0].config.data.domains.length, length);
    assert.equal(h.calls[0].config.data.waitForEnrichment, true);
    assert.equal(h.calls.length, 1);
  }
});

test("workforce supports company ID instead of domain and preserves one history cursor", async () => {
  const h = harness();
  await h.run("get-company-workforce", {
    companyId: COMPANY_ID,
    cursor: "opaque+/=",
  });
  assert.deepEqual(plain(h.calls[0].config.params), {
    id: COMPANY_ID,
    cursor: "opaque+/=",
  });
  assert.equal(h.calls.length, 1);
});

test("person int64 maximum stays decimal text without JavaScript number rounding", async () => {
  for (const slug of [
    "get-person",
    "find-work-email",
  ]) {
    const h = harness();
    await h.run(slug, {
      personId: PERSON_ID,
    });
    assert.ok(h.calls[0].config.url.includes(PERSON_ID));
    assert.ok(!h.calls[0].config.url.includes("9223372036854776000"));
  }
});

test("account output allowlist preserves safe scalars and drops all credential containers", async () => {
  const response = {
    userId: "user-1",
    apiKey: API_KEY,
    api_key: API_KEY,
    token: API_KEY,
    credentials: {
      secret: API_KEY,
    },
    nested: {
      apiKey: API_KEY,
    },
    credits: {
      used: 0,
      total: 100,
      apiKey: API_KEY,
      details: {
        token: API_KEY,
      },
    },
    capabilities: {
      lists: false,
      previews: true,
      companySearchLimit: 0,
      companySearchAsyncLimit: 10,
      peopleSearchLimit: 20,
      searchTermLimit: 30,
      unknown: API_KEY,
    },
  };
  const h = harness({
    response,
  });
  const result = await h.run("get-account");
  assert.deepEqual(plain(result), {
    userId: "user-1",
    credits: {
      used: 0,
      total: 100,
    },
    capabilities: {
      lists: false,
      previews: true,
      companySearchLimit: 0,
      companySearchAsyncLimit: 10,
      peopleSearchLimit: 20,
      searchTermLimit: 30,
    },
  });
  assert.ok(!JSON.stringify({
    result,
    summaries: h.summaries,
  }).includes(API_KEY));
  assert.equal(response.apiKey, API_KEY, "sanitizing output must not mutate the source response");
});

test("account nested objects in otherwise allowed fields cannot smuggle credentials", async () => {
  const h = harness({
    response: {
      userId: {
        apiKey: API_KEY,
      },
      credits: {
        used: {
          api_key: API_KEY,
        },
        total: 0,
      },
      capabilities: {
        lists: {
          token: API_KEY,
        },
        previews: "secret",
        companySearchLimit: {
          key: API_KEY,
        },
      },
    },
  });
  assert.deepEqual(plain(await h.run("get-account")), {
    credits: {
      total: 0,
    },
    capabilities: {},
  });
});

const INVALID = [
  [
    "enrich-company",
    {},
    "required domain",
  ],
  [
    "enrich-company",
    {
      domain: " ",
    },
    "blank domain",
  ],
  [
    "enrich-company",
    {
      domain: "x".repeat(1025),
    },
    "domain length",
  ],
  [
    "enrich-company",
    {
      domain: "example.com",
      waitForEnrichment: "false",
    },
    "boolean wait flag",
  ],
  [
    "enrich-companies",
    {
      domains: [
        "example.com",
      ],
      waitForEnrichment: 0,
    },
    "batch boolean wait flag",
  ],
  [
    "enrich-company-by-properties",
    {},
    "at least one identifier",
  ],
  [
    "enrich-company-by-properties",
    {
      name: "x".repeat(251),
    },
    "company name length",
  ],
  [
    "enrich-company-by-properties",
    {
      linkedinUrl: "x".repeat(2049),
    },
    "social URL length",
  ],
  [
    "enrich-companies",
    {},
    "batch required",
  ],
  [
    "enrich-companies",
    {
      domains: "example.com",
    },
    "batch array",
  ],
  [
    "enrich-companies",
    {
      domains: [],
    },
    "batch minimum",
  ],
  [
    "enrich-companies",
    {
      domains: Array(51).fill("example.com"),
    },
    "batch maximum",
  ],
  [
    "enrich-companies",
    {
      domains: [
        "example.com",
        "",
      ],
    },
    "batch empty domain",
  ],
  [
    "enrich-companies",
    {
      domains: [
        "x".repeat(1025),
      ],
    },
    "batch domain length",
  ],
  [
    "get-company",
    {
      companyId: "../../me",
    },
    "company path injection",
  ],
  [
    "get-company",
    {
      companyId: "not-a-uuid",
    },
    "company UUID",
  ],
  [
    "get-country",
    {
      countryCode: "US/../me",
    },
    "country path injection",
  ],
  [
    "get-country",
    {
      countryCode: "USA",
    },
    "country code length",
  ],
  [
    "get-person",
    {
      personId: Number(PERSON_ID),
    },
    "unsafe numeric person ID",
  ],
  [
    "get-person",
    {
      personId: "9223372036854775808",
    },
    "person ID int64 overflow",
  ],
  [
    "get-person",
    {
      personId: "0",
    },
    "person ID zero",
  ],
  [
    "find-work-email",
    {
      personId: "1/../../me",
    },
    "person path injection",
  ],
  [
    "find-work-email",
    {
      personId: "-1",
    },
    "person ID negative",
  ],
  [
    "enrich-person",
    {},
    "required email",
  ],
  [
    "enrich-person",
    {
      email: "x".repeat(321),
    },
    "email length",
  ],
  [
    "enrich-person",
    {
      email: "person@example.com",
      personExpand: [
        "financial",
      ],
    },
    "person expansions",
  ],
  [
    "enrich-company",
    {
      domain: "example.com",
      companyExpand: [
        "education",
      ],
    },
    "company expansions",
  ],
  [
    "get-company-workforce",
    {},
    "workforce selector required",
  ],
  [
    "get-company-workforce",
    {
      companyId: COMPANY_ID,
      domain: "example.com",
    },
    "workforce ambiguous selectors",
  ],
  [
    "get-company-workforce",
    {
      domain: "example.com",
      cursor: "x".repeat(1025),
    },
    "workforce cursor length",
  ],
  [
    "search-companies",
    {
      companyFilter: "{",
    },
    "malformed filter JSON",
  ],
  [
    "search-companies",
    {
      companyFilter: "[]",
    },
    "array filter",
  ],
  [
    "search-companies",
    {
      companyFilter: "true",
    },
    "scalar filter",
  ],
  [
    "search-companies",
    {
      semantic: {
        query: "billing",
      },
      lookalike: {
        domains: [
          "example.com",
        ],
      },
    },
    "mutually exclusive query modes",
  ],
  [
    "search-companies",
    {
      semantic: {},
    },
    "semantic query required",
  ],
  [
    "search-companies",
    {
      semantic: {
        query: "x".repeat(501),
      },
    },
    "semantic query length",
  ],
  [
    "search-companies",
    {
      semantic: {
        query: "billing",
        weight: -0.1,
      },
    },
    "semantic weight minimum",
  ],
  [
    "search-companies",
    {
      semantic: {
        query: "billing",
        weight: 1.1,
      },
    },
    "semantic weight maximum",
  ],
  [
    "search-companies",
    {
      semantic: {
        query: "billing",
        autoFilter: "false",
      },
    },
    "semantic boolean",
  ],
  [
    "search-companies",
    {
      semantic: {
        query: "billing",
        extra: true,
      },
    },
    "unknown semantic key",
  ],
  [
    "search-companies",
    {
      lookalike: {
        domains: [],
      },
    },
    "lookalike seeds minimum",
  ],
  [
    "search-companies",
    {
      lookalike: {
        domains: Array(11).fill("example.com"),
      },
    },
    "lookalike seeds maximum",
  ],
  [
    "search-companies",
    {
      lookalike: {
        domains: [
          "example.com",
        ],
        weight: -1.1,
      },
    },
    "lookalike weight minimum",
  ],
  [
    "search-companies",
    {
      lookalike: {
        domains: [
          "example.com",
        ],
        weight: 1.1,
      },
    },
    "lookalike weight maximum",
  ],
  [
    "search-companies",
    {
      lookalike: {
        domains: [
          "example.com",
        ],
        minScore: -0.1,
      },
    },
    "lookalike score minimum",
  ],
  [
    "search-companies",
    {
      lookalike: {
        domains: [
          "example.com",
        ],
        minScore: 1.1,
      },
    },
    "lookalike score maximum",
  ],
  [
    "search-people",
    {
      personFilter: 1,
    },
    "person filter object",
  ],
  [
    "search-people",
    {
      companyQuery: {
        domains: [
          "example.com",
        ],
      },
    },
    "v2 employer query shape",
  ],
  [
    "search-people",
    {
      companyQuery: {
        pageSize: 100,
        expand: [
          "financial",
        ],
      },
    },
    "employer query cannot include paid pages",
  ],
  [
    "search-people",
    {
      companyQuery: {
        semantic: {
          query: "billing",
        },
        lookalike: {
          domains: [
            "example.com",
          ],
        },
      },
    },
    "nested query modes",
  ],
  [
    "search-states",
    {
      countryCodes: [
        "USA",
      ],
    },
    "country codes validation",
  ],
  [
    "search-states",
    {
      countryCodes: Array(251).fill("US"),
    },
    "country codes maximum",
  ],
  [
    "search-cities",
    {
      stateIds: [
        "0",
      ],
    },
    "state ID zero",
  ],
  [
    "search-cities",
    {
      stateIds: [
        "-1",
      ],
    },
    "state ID negative",
  ],
  [
    "search-cities",
    {
      stateIds: [
        "1.5",
      ],
    },
    "state ID decimal",
  ],
  [
    "search-cities",
    {
      stateIds: [
        "2147483648",
      ],
    },
    "state ID int32 overflow",
  ],
  [
    "search-cities",
    {
      stateIds: Array(101).fill("1"),
    },
    "state IDs maximum",
  ],
];
for (const slug of [
  "search-companies",
  "search-people",
  "search-countries",
  "search-states",
  "search-cities",
]) {
  for (const pageSize of [
    0,
    101,
    1.5,
    "10",
    false,
  ]) {
    INVALID.push([
      slug,
      {
        pageSize,
      },
      `invalid pageSize ${JSON.stringify(pageSize)}`,
    ]);
  }
  INVALID.push([
    slug,
    {
      cursor: "x".repeat(slug.includes("countries") || slug.includes("states") || slug.includes("cities")
        ? 2049
        : 1025),
    },
    "cursor limit",
  ]);
}
for (const slug of [
  "autocomplete-companies",
  "lookup-keywords",
  "lookup-technologies",
  "lookup-positions",
]) {
  INVALID.push([
    slug,
    {},
    "required suggestion query",
  ]);
  INVALID.push([
    slug,
    {
      query: "x".repeat(101),
    },
    "suggestion query limit",
  ]);
}
for (const [
  slug,
  input,
  reason,
] of INVALID) {
  test(`${slug}: rejects ${reason} before any HTTP request`, async () => {
    const h = harness();
    await assert.rejects(h.run(slug, input), ConfigurationError);
    assert.equal(h.calls.length, 0);
    assert.equal(h.summaries.length, 0);
  });
}

test("app-level path methods also reject unsafe IDs before transport", async () => {
  const h = harness();
  const app = await h.appInstance();
  for (const [
    method,
    input,
  ] of [
      [
        "getCompany",
        {
          companyId: "../../me",
        },
      ],
      [
        "getPerson",
        {
          personId: "1/../../me",
        },
      ],
      [
        "findWorkEmail",
        {
          personId: "9223372036854775808",
        },
      ],
      [
        "getCountry",
        {
          countryCode: "../me",
        },
      ],
    ]) {
    assert.throws(() => app[method](input), ConfigurationError);
  }
  assert.equal(h.calls.length, 0);
});

for (const fixture of ROUTES) {
  test(`${fixture.slug}: API error is preserved after exactly one attempt`, async () => {
    const error = Object.assign(new Error("Provider rejected request"), {
      response: {
        status: 429,
        data: {
          title: "Rate limited",
          retryAfter: 60,
        },
      },
    });
    const h = harness({
      error,
    });
    await assert.rejects(h.run(fixture.slug, fixture.input), (actual) => actual === error);
    assert.equal(h.calls.length, 1);
    assert.equal(h.summaries.length, 0);
  });
}

test("raw JSON person IDs and counts preserve int64 precision while normal numbers stay numbers", async () => {
  const h = harness({
    response: "{\"items\":[{\"id\":9223372036854775807,\"score\":0.75,\"employees\":10}],\"nextCursor\":\"opaque\",\"count\":9223372036854775807,\"total\":42}",
  });
  const result = await h.run("search-people");
  assert.deepEqual(plain(result), {
    items: [
      {
        id: PERSON_ID,
        score: 0.75,
        employees: 10,
      },
    ],
    nextCursor: "opaque",
    count: PERSON_ID,
    total: 42,
  });
  const lookup = harness();
  await lookup.run("get-person", {
    personId: result.items[0].id,
  });
  assert.equal(lookup.calls[0].config.url, `/people/${PERSON_ID}`);
});

test("response parser ignores prototype keys and keeps ordinary nested fields", async () => {
  const h = harness({
    response: "{\"items\":[{\"id\":1,\"__proto__\":{\"polluted\":true},\"constructor\":{\"prototype\":{\"polluted\":true}},\"name\":\"Example\"}]}",
  });
  const result = await h.run("search-people");
  assert.deepEqual(plain(result), {
    items: [
      {
        id: 1,
        name: "Example",
      },
    ],
  });
  assert.equal({}.polluted, undefined);
});

test("non-JSON or malformed provider response text remains available to error handling", async () => {
  for (const response of [
    "upstream temporarily unavailable",
    "{\"invalid\":",
  ]) {
    const h = harness({
      response,
    });
    const result = await h.run("search-companies");
    assert.equal(result, response);
    assert.equal(h.calls.length, 1);
  }
});
