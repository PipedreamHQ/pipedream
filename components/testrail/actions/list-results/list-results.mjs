import app from "../../testrail.app.mjs";

const DEFAULT_FIELDS = [
  "test_id",
  "case_id",
  "status_id",
  "comment",
  "defects",
  "created_on",
  "created_by",
];

export default {
  key: "testrail-list-results",
  name: "List Results",
  description: "Lists recorded results (status, comment, defects) newest first, for one test, for every test of a run, or for one case within a run. Use it to read a failure comment or a test's history. Pass exactly one of: `testId`; `runId` alone; or `runId` with `caseId`. To record a new result use **Add Result**; for the current status only, **Get Test** is cheaper. Returns id, test_id, case_id, status_id, comment, defects, created_on (unix seconds) and created_by by default, plus `hasMore`/`nextOffset`. Example: testId=3659 → its results, newest first, with the failure comment. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    testId: {
      type: "integer",
      label: "Test ID",
      description: "Return the results of this test. Do not combine with `runId`. Use **List Tests** to find it.",
      optional: true,
    },
    runId: {
      propDefinition: [
        app,
        "runId",
      ],
      description: "Return results for every test in this run, or, together with `caseId`, for one case in it. Do not combine with `testId`.",
      optional: true,
    },
    caseId: {
      propDefinition: [
        app,
        "caseId",
      ],
      description: "With `runId`: only the results of this case in that run.",
      optional: true,
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
      description: "Result fields to return (id is always included). Default: id, test_id, case_id, status_id, comment, defects, created_on, created_by. Other useful ones: version, elapsed, assignedto_id.",
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
    let path;
    if (this.testId && !this.runId && !this.caseId) path = `get_results/${this.testId}`;
    else if (this.runId && this.caseId && !this.testId) path = `get_results_for_case/${this.runId}/${this.caseId}`;
    else if (this.runId && !this.testId && !this.caseId) path = `get_results_for_run/${this.runId}`;
    else throw new Error("Pass exactly one of: testId; runId; or runId with caseId");
    const page = await this.app.listPage({
      $,
      path,
      key: "results",
      params: this.app.cleanParams({
        status_id: this.statusIds?.join(","),
      }),
      limit: this.limit,
      offset: this.offset,
    });
    page.items = this.app.pluck(page.items, this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS);
    $.export("$summary", `Found ${page.size} results`);
    return page;
  },
};
