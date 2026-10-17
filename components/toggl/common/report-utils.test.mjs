import assert from "node:assert/strict";
import test from "node:test";
import {
  compactSummaryReport,
  validateDetailedPage,
} from "./report-utils.mjs";

test("validateDetailedPage accepts contiguous rows and counts nested entries", () => {
  const seenEntryIds = new Set();
  const result = validateDetailedPage({
    page: [
      {
        row_number: 1,
        billable: true,
        time_entries: [
          {
            id: 101,
            seconds: 3600,
          },
        ],
      },
      {
        row_number: 2,
        billable: false,
        time_entries: [
          {
            id: 102,
            seconds: 1800,
          },
        ],
      },
    ],
    expectedFirstRowNumber: 1,
    seenEntryIds,
  });

  assert.deepEqual(result, {
    reportRowCount: 2,
    entryCount: 2,
    trackedSeconds: 5400,
    billableSeconds: 3600,
    nextExpectedRowNumber: 3,
  });
  assert.deepEqual([
    ...seenEntryIds,
  ], [
    "101",
    "102",
  ]);
});
test("validateDetailedPage rejects skipped rows and duplicate entry IDs", () => {
  assert.throws(() => validateDetailedPage({
    page: [
      {
        row_number: 3,
        billable: false,
        time_entries: [
          {
            id: 103,
            seconds: 60,
          },
        ],
      },
    ],
    expectedFirstRowNumber: 2,
    seenEntryIds: new Set(),
  }), /Expected row 2, received 3/);

  assert.throws(() => validateDetailedPage({
    page: [
      {
        row_number: 2,
        billable: false,
        time_entries: [
          {
            id: 101,
            seconds: 60,
          },
        ],
      },
    ],
    expectedFirstRowNumber: 2,
    seenEntryIds: new Set([
      "101",
    ]),
  }), /duplicate time entry ID 101/);
});
test("compactSummaryReport removes nested payloads and preserves exact totals", () => {
  const result = compactSummaryReport({
    groups: [
      {
        id: 1,
        names: [
          "First User",
        ],
        sub_groups: [
          {
            seconds: 3600,
            rates: [
              {
                billable_seconds: 1800,
              },
            ],
            ids: [
              101,
              102,
            ],
          },
        ],
      },
      {
        id: 2,
        names: [
          "Second User",
        ],
        sub_groups: {
          ungrouped: {
            seconds: 900,
            ids: [
              103,
            ],
          },
        },
      },
    ],
  });

  assert.deepEqual(result, {
    groups: [
      {
        id: 1,
        name: "First User",
        trackedSeconds: 3600,
        billableSeconds: 1800,
        entryCount: 2,
      },
      {
        id: 2,
        name: "Second User",
        trackedSeconds: 900,
        billableSeconds: 0,
        entryCount: 1,
      },
    ],
    groupCount: 2,
    entryCount: 3,
  });
});
