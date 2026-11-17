import app from "../../testrail.app.mjs";

export default {
  key: "testrail-add-results",
  name: "Add Results",
  description: "Records results for many tests of one TestRail run in a single call, for example reporting a CI run. Use it when more than one test needs a result; for one test use **Add Result**. Each entry identifies its target by `case_id` (preferred, from **List Cases**) or by `test_id` (from **List Tests**), not both. A case must already be part of the run. Returns the created results (id, test_id, status_id, comment). Example: runId=57, results=[{\"case_id\":1067,\"status_id\":1},{\"case_id\":1068,\"status_id\":5,\"comment\":\"CI timeout\"}] → two results recorded. [See the documentation](https://support.testrail.com/hc/en-us/sections/7077185274644-API-reference)",
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
    runId: {
      propDefinition: [
        app,
        "runId",
      ],
    },
    results: {
      type: "string",
      label: "Results",
      description: "JSON array of results. Each item needs `status_id` and either `case_id` or `test_id`; each item may also carry `comment`, `defects`, `version` and `elapsed`. Example: `[{\"case_id\":1067,\"status_id\":1},{\"case_id\":1068,\"status_id\":5,\"comment\":\"CI timeout\"}]`.",
    },
  },
  async run({ $ }) {
    const results = typeof this.results === "string"
      ? JSON.parse(this.results)
      : this.results;
    if (!Array.isArray(results) || !results.length) {
      throw new Error("results must be a non-empty JSON array");
    }
    const byCase = results.filter((r) => r.case_id !== undefined);
    const byTest = results.filter((r) => r.case_id === undefined);
    const created = [];
    if (byCase.length) {
      created.push(...await this.app.post({
        $,
        path: `add_results_for_cases/${this.runId}`,
        data: {
          results: byCase,
        },
      }));
    }
    if (byTest.length) {
      created.push(...await this.app.post({
        $,
        path: `add_results/${this.runId}`,
        data: {
          results: byTest,
        },
      }));
    }
    $.export("$summary", `Recorded ${created.length} results in run ${this.runId}`);
    return created.map(({
      id, test_id, status_id, comment,
    }) => ({
      id,
      test_id,
      status_id,
      comment,
    }));
  },
};
