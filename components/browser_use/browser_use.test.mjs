import assert from "node:assert/strict";
import test from "node:test";

import browserUse from "./browser_use.app.mjs";
import cancelRun from "./actions/cancel-run/cancel-run.mjs";
import createRun from "./actions/create-run/create-run.mjs";
import getRun from "./actions/get-run/get-run.mjs";
import listRuns from "./actions/list-runs/list-runs.mjs";

const summarySink = () => {
  const summaries = [];
  return {
    $: {
      export: (...args) => summaries.push(args),
    },
    summaries,
  };
};

test("run picker follows the V4 cursor envelope", async () => {
  const calls = [];
  const result = await browserUse.propDefinitions.runId.options.call(
    {
      listRuns: async (request) => {
        calls.push(request);
        return {
          runs: [
            {
              id: "run-1",
              task: "Check pricing",
              status: "completed",
            },
          ],
          hasMore: true,
          nextCursor: "next-page",
        };
      },
    },
    {
      prevContext: {
        cursor: "current-page",
      },
    },
  );

  assert.deepEqual(calls, [
    {
      params: {
        limit: 50,
        cursor: "current-page",
      },
    },
  ]);
  assert.deepEqual(result, {
    options: [
      {
        label: "Check pricing (completed)",
        value: "run-1",
      },
    ],
    context: {
      cursor: "next-page",
    },
  });
});

test("create run sends the V4 body without undefined fields", async () => {
  const requests = [];
  const {
    $, summaries,
  } = summarySink();
  const result = await createRun.run.call(
    {
      browserUse: {
        createRun: async (request) => {
          requests.push(request);
          return {
            id: "run-1",
            sessionId: "session-1",
          };
        },
      },
      task: "Check pricing",
      browserSettings: {
        proxyCountryCode: "us",
      },
      agentmail: false,
    },
    {
      $,
    },
  );

  assert.equal(result.id, "run-1");
  assert.deepEqual(requests[0].data, {
    task: "Check pricing",
    browserSettings: {
      proxyCountryCode: "us",
    },
    agentmail: false,
  });
  assert.deepEqual(summaries, [
    [
      "$summary",
      "Created V4 run run-1 in session session-1",
    ],
  ]);
});

test("list run forwards cursor and session filters", async () => {
  const requests = [];
  const {
    $, summaries,
  } = summarySink();
  await listRuns.run.call(
    {
      browserUse: {
        listRuns: async (request) => {
          requests.push(request);
          return {
            runs: [
              {
                id: "run-2",
              },
            ],
          };
        },
      },
      limit: 25,
      cursor: "cursor-1",
      sessionId: "session-1",
    },
    {
      $,
    },
  );

  assert.deepEqual(requests[0].params, {
    limit: 25,
    cursor: "cursor-1",
    sessionId: "session-1",
  });
  assert.deepEqual(summaries, [
    [
      "$summary",
      "Retrieved 1 V4 runs",
    ],
  ]);
});

test("get and cancel encode the selected run ID", async () => {
  const seen = [];
  const getSink = summarySink();
  const cancelSink = summarySink();

  await getRun.run.call(
    {
      browserUse: {
        getRun: async (request) => {
          seen.push([
            "get",
            request.runId,
          ]);
          return {
            id: request.runId,
            status: "running",
          };
        },
      },
      runId: "run/with/slash",
    },
    {
      $: getSink.$,
    },
  );
  await cancelRun.run.call(
    {
      browserUse: {
        cancelRun: async (request) => {
          seen.push([
            "cancel",
            request.runId,
          ]);
          return {
            status: "cancelled",
          };
        },
      },
      runId: "run-2",
    },
    {
      $: cancelSink.$,
    },
  );

  assert.deepEqual(seen, [
    [
      "get",
      "run/with/slash",
    ],
    [
      "cancel",
      "run-2",
    ],
  ]);
});

test("app methods target only V4 run routes", () => {
  const calls = [];
  const app = {
    _makeV4Request: (request) => calls.push(request),
  };

  browserUse.methods.createRun.call(app, {
    data: {
      task: "Check pricing",
    },
  });
  browserUse.methods.listRuns.call(app, {
    params: {
      limit: 10,
    },
  });
  browserUse.methods.getRun.call(app, {
    runId: "run/1",
  });
  browserUse.methods.cancelRun.call(app, {
    runId: "run/1",
  });

  assert.deepEqual(calls, [
    {
      method: "POST",
      path: "/runs",
      data: {
        task: "Check pricing",
      },
    },
    {
      path: "/runs",
      params: {
        limit: 10,
      },
    },
    {
      path: "/runs/run%2F1",
    },
    {
      method: "POST",
      path: "/runs/run%2F1/cancel",
    },
  ]);
});
