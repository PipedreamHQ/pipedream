import app from "../../testrail.app.mjs";
import { parseJson } from "../../common/utils.mjs";

const ALIASES = {
  caseId: "case_id",
  statusId: "status_id",
  assignedToId: "assignedto_id",
};

export default {
  key: "testrail-add-results-for-cases",
  name: "Add Results For Cases",
  description: "Record results for many cases of one run in a single call — for CI/automation reporting. Each entry names a case and a status; cases must belong to the run. For a single test prefer **Add Result**. Use **List Tests** (case_id per test) to find case ids and **List Metadata** (kind=statuses) for status ids (1 Passed, 2 Blocked, 4 Retest, 5 Failed by default). Results cannot be deleted. Example: runId=88, results=`[{\"caseId\": 301, \"statusId\": 1}, {\"caseId\": 302, \"statusId\": 5, \"comment\": \"CI build 4411: timed out\"}]` → returns the created results. Optional keys per entry: comment, defects, elapsed, assignedToId, and any custom result field (e.g. custom_browser). [See the documentation](https://support.testrail.com/hc/en-us/articles/7077819312404-Results#addresultsforcases)",
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
      description: "JSON array of results: `[{\"caseId\": 301, \"statusId\": 5, \"comment\": \"…\"}]`. `case_id` / `status_id` spellings are also accepted.",
    },
  },
  async run({ $ }) {
    const entries = parseJson(this.results, "results", "array");
    if (!entries.length) {
      throw new Error("results must contain at least one entry");
    }
    const results = entries.map((entry) => Object.fromEntries(Object.entries(entry).map(([
      key,
      value,
    ]) => [
      ALIASES[key] ?? key,
      value,
    ])));
    const missing = results.findIndex((r) => !r.case_id || !r.status_id);
    if (missing !== -1) {
      throw new Error(`results[${missing}] needs both caseId and statusId`);
    }
    const response = await this.app.addResultsForCases({
      $,
      runId: this.runId,
      data: {
        results,
      },
    });
    $.export("$summary", `Added ${results.length} result(s) to run ${this.runId}`);
    return response;
  },
};
