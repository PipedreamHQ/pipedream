import app from "../../testrail.app.mjs";

const DEFAULT_FIELDS = [
  "case_id",
  "run_id",
  "title",
  "status_id",
  "assignedto_id",
];

export default {
  key: "testrail-list-tests",
  name: "List Tests",
  description: "Lists the tests of a TestRail run, optionally only those with certain statuses. A test is one case inside one run; its status is the latest result recorded on it. Use it for triage (for example Retest and Failed tests of the latest run) and to get the test IDs that **Add Result** needs. To browse the case library use **List Cases**; for a test's result history use **List Results**. Returns id (the test ID), case_id, run_id, title, status_id and assignedto_id by default, plus `hasMore`/`nextOffset`. Example: runId=54, statusIds=[4,5] → the Retest and Failed tests of run 54 with their test IDs. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
      propDefinition: [
        app,
        "statusIds",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Test fields to return (id is always included). Default: id, case_id, run_id, title, status_id, assignedto_id. Other useful ones: priority_id, type_id, refs, estimate.",
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
    const page = await this.app.listPage({
      $,
      path: `get_tests/${this.runId}`,
      key: "tests",
      params: this.app.cleanParams({
        status_id: this.statusIds?.join(","),
      }),
      limit: this.limit,
      offset: this.offset,
    });
    page.items = this.app.pluck(page.items, this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS);
    $.export("$summary", `Found ${page.size} tests in run ${this.runId}`);
    return page;
  },
};
