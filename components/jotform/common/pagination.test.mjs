import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import test from "node:test";
import jotform from "../jotform.app.mjs";
import listForms from "../actions/list-forms/list-forms.mjs";
import getFormSubmissions from "../actions/get-form-submissions/get-form-submissions.mjs";
import getUserSubmissions from "../actions/get-user-submissions/get-user-submissions.mjs";
import listTeamOptions from "../actions/list-team-id-options/list-team-id-options.mjs";

async function fixture(t, total = 45) {
  const requests = [];
  const items = Array.from({
    length: total,
  }, (_, i) => ({
    id: String(i),
    title: `Form ${i}`,
    name: `Team ${i}`,
  }));
  const server = createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    requests.push({
      url,
      headers: req.headers,
    });
    const offset = Number(url.searchParams.get("offset") || 0);
    const limit = Number(url.searchParams.get("limit") || 20);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
      content: items.slice(offset, offset + limit),
    }));
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const app = {
    ...jotform.methods,
    $auth: {
      api_key: "synthetic",
    },
    _getBaseUrl: () => `http://127.0.0.1:${server.address().port}/`,
  };
  for (const [
    key,
    value,
  ] of Object.entries(app)) {
    if (typeof value === "function") app[key] = value.bind(app);
  }
  const run = (action, props) => action.run.call({
    ...action.methods,
    jotform: app,
    ...props,
  }, {
    $: {
      export() {},
    },
  });
  return {
    app,
    items,
    requests,
    run,
  };
}

for (const [
  action,
  endpoint,
  props,
] of [
    [
      listForms,
      "/user/forms",
      {
        teamId: "team",
      },
    ],
    [
      getFormSubmissions,
      "/form/form-id/submissions",
      {
        formId: "form-id",
        teamId: "team",
      },
    ],
    [
      getUserSubmissions,
      "/user/submissions",
      {},
    ],
  ]) {
  for (const [
    total,
    max,
    count,
    offsets,
  ] of [
      [
        45,
        30,
        30,
        [
          0,
          20,
        ],
      ],
      [
        45,
        60,
        45,
        [
          0,
          20,
          40,
        ],
      ],
      [
        45,
        20,
        20,
        [
          0,
        ],
      ],
      [
        0,
        30,
        0,
        [
          0,
        ],
      ],
    ]) {
    test(`${action.key}: ${total} records, max ${max}`, async (t) => {
      const {
        items, requests, run,
      } = await fixture(t, total);
      const result = await run(action, {
        ...props,
        max,
      });
      assert.deepEqual(result, items.slice(0, count));
      assert.deepEqual(requests.map(({ url }) => Number(url.searchParams.get("offset"))), offsets);
      for (const {
        url, headers,
      } of requests) {
        assert.equal(url.pathname, endpoint);
        assert.equal(url.searchParams.get("limit"), "20");
        assert.equal(headers.apikey, "synthetic");
        assert.equal(headers["jf-team-id"], props.teamId);
      }
    });
  }
}

test("paginator preserves nested query parameters and does not mutate its input", async (t) => {
  const {
    app, items, requests,
  } = await fixture(t);
  const options = {
    max: 11,
    teamId: "team",
    params: {
      offset: 5,
      limit: 7,
      orderby: "id",
    },
  };
  const original = structuredClone(options);
  const result = [];
  for await (const item of listForms.methods.paginate(app.getForms, options)) result.push(item);
  assert.deepEqual(result, items.slice(5, 16));
  assert.deepEqual(options, original);
  assert.deepEqual(requests.map(({ url }) => url.searchParams.get("offset")), [
    "5",
    "12",
  ]);
  assert.ok(requests.every(({ url }) => url.searchParams.get("orderby") === "id"));
});

test("existing Form options retain their page and team", async (t) => {
  const {
    app, requests,
  } = await fixture(t);
  const result = await jotform.propDefinitions.formId.options.call(app, {
    page: 1,
    teamId: "team",
  });
  assert.equal(result[0].value, "20");
  assert.equal(requests[0].url.searchParams.get("offset"), "20");
  assert.equal(requests[0].headers["jf-team-id"], "team");
});

test("Team options forward distinct page parameters to the API", async (t) => {
  const {
    requests, run,
  } = await fixture(t);
  const first = await run(listTeamOptions, {
    page: 0,
  });
  const second = await run(listTeamOptions, {
    page: 1,
  });
  assert.equal(first[0].value, "0");
  assert.equal(second[0].value, "20");
  assert.deepEqual(requests.map(({ url }) => url.searchParams.get("offset")), [
    "0",
    "20",
  ]);
});
