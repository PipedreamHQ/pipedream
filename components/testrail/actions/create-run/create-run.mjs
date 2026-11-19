import app from "../../testrail.app.mjs";

export default {
  key: "testrail-create-run",
  name: "Create Run",
  description: "Create a test run: a set of tests to execute and record results against. Use it to start a regression pass, or a re-run of specific cases (for example the ones that failed last time, found with **List Tests**). By default the run includes every case in the suite; pass `caseIds` to include only those cases. To record outcomes into a run use **Add Result**, and to find existing runs use **List Runs**. Multi-suite projects need a suite ID. Returns the run's id, name, suite_id, url and status counts. Example: projectId=4, suiteId=15, name=\"Rerun of failures\", caseIds=[1064, 1065] → {id: 90, name: \"Rerun of failures\", untested_count: 2}. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The run's name, e.g. `Regression 2026-11-18`.",
    },
    suiteId: {
      propDefinition: [
        app,
        "suiteId",
      ],
    },
    caseIds: {
      type: "integer[]",
      label: "Case IDs",
      description: "Include only these cases, e.g. `[1064, 1065]`. Leave empty to include every case in the suite. Use **List Cases** to find IDs (these are case IDs, not test IDs).",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "What the run is for, e.g. `Re-run of failures from nightly 214`.",
      optional: true,
    },
    assignedToId: {
      type: "integer",
      label: "Assigned To ID",
      description: "The user ID to assign the run to, e.g. `1`. Use **Get Current User** for your own ID.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      include_all: !this.caseIds?.length,
    };
    if (this.suiteId) data.suite_id = this.suiteId;
    if (this.caseIds?.length) data.case_ids = this.caseIds.map(Number);
    if (this.description) data.description = this.description;
    if (this.assignedToId) data.assignedto_id = this.assignedToId;
    const run = await this.app._makeRequest({
      $,
      method: "POST",
      endpoint: `add_run/${this.projectId}`,
      data,
    });
    $.export("$summary", `Created run ${run.id}: ${run.name}`);
    return this.app.shape(run, [], [
      "name",
      "suite_id",
      "include_all",
      "passed_count",
      "failed_count",
      "untested_count",
      "created_on",
      "url",
    ]);
  },
};
