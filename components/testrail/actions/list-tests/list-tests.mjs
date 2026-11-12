import app from "../../testrail.app.mjs";
import utils from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "case_id",
  "run_id",
  "title",
  "status_id",
  "assignedto_id",
  "priority_id",
];

export default {
  key: "testrail-list-tests",
  name: "List Tests",
  description: "List the tests in a TestRail run (a test is a case inside a run) with their current status. This is the starting point for failure triage: filter with statusIds to get only the failures, then read the history with **Get Results for Test** or record a verdict with **Add Result**. The `id` of each item is the TEST ID those tools need; `case_id` is a different number. Get the run ID from **List Runs** and the status IDs from **Get Metadata** (resource `statuses`; by default 1 Passed, 2 Blocked, 3 Untested, 4 Retest, 5 Failed). Example: to list failed and retest tests in run 345, call with runId=345, statusIds=[4, 5] → returns tests with id, case_id, title, status_id, assignedto_id. Common mistake: passing a case ID as testId to other tools. Returns at most 250 tests by default (hard cap 1000); `has_more` is true if the run has more. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077874763156-Tests)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    runId: {
      propDefinition: [
        app,
        "runId",
      ],
    },
    statusIds: {
      type: "integer[]",
      label: "Status IDs",
      description: "Only tests whose current status is one of these IDs, e.g. `[4, 5]` for Retest and Failed. Omit for all statuses. Check **Get Metadata** (resource `statuses`) for the instance's IDs.",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
      description: `Field names to return per test (\`id\` is always included). Defaults to: ${DEFAULT_FIELDS.join(", ")}. Other available: estimate, refs, labels, custom_* case fields.`,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.statusIds?.length) {
      params.status_id = this.statusIds.join(",");
    }
    const {
      items, hasMore,
    } = await this.app.paginate({
      $,
      path: `get_tests/${this.runId}`,
      resourceKey: "tests",
      params,
      max: this.limit,
    });
    const tests = utils.selectFields(items, this.fields, DEFAULT_FIELDS);
    $.export("$summary", `Found ${tests.length} test${tests.length === 1
      ? ""
      : "s"} in run ${this.runId}`);
    return {
      tests,
      has_more: hasMore,
    };
  },
};
