import assert from "node:assert/strict";
import test from "node:test";
import {
  buildProjectActivityOutput,
  flattenDetailedRows,
  getQuerySignature,
  matchesDescription,
} from "./activity-utils.mjs";
import {
  resolveNamedResource,
  resolveWorkspaceProject,
} from "./utils.mjs";

test("description matching is deterministic", () => {
  assert.equal(matchesDescription("Drafted client update", "client", "contains"), true);
  assert.equal(matchesDescription("Drafted client update", "DRAFTED CLIENT UPDATE", "exact"), true);
  assert.equal(matchesDescription("Drafted the weekly client update", "weekly update", "all_terms"), true);
  assert.equal(matchesDescription("Internal planning", "client", "contains"), false);
});

test("activity digest preserves exact descriptions and combines repeated work", () => {
  const entries = flattenDetailedRows([
    {
      row_number: 1,
      user_id: 1,
      username: "First User",
      project_id: 10,
      project_name: "Lexamica",
      task_id: 20,
      task_name: "Client update",
      description: "Drafted client update",
      billable: true,
      time_entries: [
        {
          id: 101,
          start: "2026-10-05T09:00:00-05:00",
          stop: "2026-10-05T10:00:00-05:00",
          seconds: 3600,
        },
      ],
    },
    {
      row_number: 2,
      user_id: 2,
      username: "Second User",
      project_id: 10,
      project_name: "Lexamica",
      task_id: 20,
      task_name: "Client update",
      description: "Drafted   client update",
      billable: false,
      time_entries: [
        {
          id: 102,
          start: "2026-10-06T09:00:00-05:00",
          stop: "2026-10-06T09:30:00-05:00",
          seconds: 1800,
        },
      ],
    },
  ]);
  const result = buildProjectActivityOutput({
    entries,
    responseMode: "activity_digest",
    bucketBy: "week",
    includeEntryIds: true,
  });

  assert.equal(result.activities.length, 1);
  assert.equal(result.activities[0].description, "Drafted client update");
  assert.deepEqual(result.activities[0].descriptionVariants, [
    "Drafted client update",
    "Drafted   client update",
  ]);
  assert.equal(result.activities[0].entryCount, 2);
  assert.equal(result.activities[0].trackedSeconds, 5400);
  assert.equal(result.activities[0].billableSeconds, 3600);
  assert.deepEqual(result.activities[0].entryIds, [
    101,
    102,
  ]);
  assert.equal(result.activities[0].contributors.length, 2);
});

test("query signatures ignore object key order but preserve filters", () => {
  assert.equal(getQuerySignature({
    projectIds: [
      1,
    ],
    startDate: "2026-01-01",
  }), getQuerySignature({
    startDate: "2026-01-01",
    projectIds: [
      1,
    ],
  }));
  assert.notEqual(getQuerySignature({
    projectIds: [
      1,
    ],
  }), getQuerySignature({
    projectIds: [
      2,
    ],
  }));
});

test("project resolution rejects ambiguous names instead of guessing", () => {
  assert.throws(() => resolveWorkspaceProject([
    {
      id: 1,
      name: "Client Portal",
      client_name: "First Client",
    },
    {
      id: 2,
      name: "Client Planning",
      client_name: "Second Client",
    },
  ], "Client"), /Project Name is ambiguous/);
});

test("resource resolution can preserve duplicate exact task names", () => {
  const matches = resolveNamedResource({
    resources: [
      {
        id: 1,
        name: "Client update",
      },
      {
        id: 2,
        name: "Client update",
      },
      {
        id: 3,
        name: "Client planning",
      },
    ],
    query: "Client update",
    resourceLabel: "task in the selected projects",
    queryLabel: "Task Name",
    allowMultipleExact: true,
  });

  assert.deepEqual(matches.map((task) => task.id), [
    1,
    2,
  ]);
});

test("resource resolution returns an array for one partial task-name match", () => {
  const matches = resolveNamedResource({
    resources: [
      {
        id: 1,
        name: "Client update",
      },
      {
        id: 2,
        name: "Internal planning",
      },
    ],
    query: "Client",
    resourceLabel: "task in the selected projects",
    queryLabel: "Task Name",
    allowMultipleExact: true,
  });

  assert.deepEqual(matches.map((task) => task.id), [
    1,
  ]);
});
