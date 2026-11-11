import app from "../../testrail.app.mjs";
import {
  pluck, toPage,
} from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "title",
  "case_id",
  "status_id",
  "run_id",
  "assignedto_id",
  "priority_id",
];

export default {
  key: "testrail-list-tests",
  name: "List Tests",
  description: "List the tests in a TestRail run, optionally only those with certain statuses — the entry point for failure triage. A test is a case inside a run; its `id` (test id) is what **Add Result** and **List Results** take, and `case_id` is the underlying case. Use **List Runs** first for `runId`, and **List Metadata** (kind=statuses) for status ids. Example: runId=88, statusIds=[4,5] → returns the Retest and Failed tests as [{id: 5012, title: \"Verify paddock fence voltage alarm\", case_id: 301, status_id: 5}]. Returns a compact set of fields by default (id, title, case_id, status_id, run_id, assignedto_id, priority_id); pass `fields` for more (e.g. `custom_steps`). Common mistake: using a case id where a test id is needed. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077874763156-Tests)",
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
      description: "Only tests whose current status is one of these ids, e.g. `[5]` Failed or `[4,5]` Retest + Failed. Defaults: 1 Passed, 2 Blocked, 3 Untested, 4 Retest, 5 Failed (custom statuses have other ids — see **List Metadata**). Omit for all tests.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: `Fields to return per test (\`id\` is always included). Default: ${DEFAULT_FIELDS.join(", ")}. Pass only what you need to keep responses small.`,
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
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
    const limit = this.limit ?? 100;
    const response = await this.app.getTests({
      $,
      runId: this.runId,
      params: {
        status_id: this.statusIds?.length
          ? this.statusIds
          : undefined,
        limit,
        offset: this.offset,
      },
    });
    const page = toPage(response, "tests", {
      offset: this.offset ?? 0,
      limit,
    });
    const fields = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    page.tests = page.tests.map((test) => pluck(test, fields));
    $.export("$summary", `Found ${page.count} test(s) in run ${this.runId}`);
    return page;
  },
};
