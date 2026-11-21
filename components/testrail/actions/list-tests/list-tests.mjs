import app from "../../testrail.app.mjs";
import {
  joinIds, pluck,
} from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "case_id",
  "title",
  "status_id",
  "run_id",
  "assignedto_id",
];

export default {
  key: "testrail-list-tests",
  name: "List Tests",
  description: "Lists the tests in a TestRail run, optionally only those with certain statuses. Use it for triage: \"which tests failed in this run\" returns the test IDs that **Add Result** and **List Test Results** need. Not for the result history of one test (use **List Test Results**) or the case definitions of a suite (use **List Cases**); find the run ID with **List Runs**. A test's status is its latest result. Returns each test's id, case_id, title, status_id, run_id and assignedto_id, plus has_more and next_offset when truncated; pass `fields` to return more or fewer. Example: runId=86, statusIds=[4, 5] → the Retest and Failed tests of run 86. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      description: "Only return tests whose current status is one of these IDs. Defaults are 1 Passed, 2 Blocked, 3 Untested, 4 Retest, 5 Failed; use **Get Statuses** for custom ones. Leave empty for all tests. Example: `[4, 5]`.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Field names to return per test (`id` is always included). Defaults to: case_id, title, status_id, run_id, assignedto_id. Other useful values: `priority_id`, `type_id`, `refs`, `estimate`, `custom_steps_separated`, `custom_expected`.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const {
      items, has_more, next_offset,
    } = await this.app.paginate({
      $,
      path: `get_tests/${this.runId}`,
      key: "tests",
      params: {
        status_id: joinIds(this.statusIds),
      },
      maxResults: this.maxResults ?? 250,
      offset: this.offset,
    });
    const fields = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    const tests = items.map((t) => pluck(t, fields));
    $.export("$summary", `Found ${tests.length} test(s) in run ${this.runId}`);
    return {
      tests,
      has_more,
      next_offset,
    };
  },
};
