import app from "../../testrail.app.mjs";
import { toPage } from "../../common/utils.mjs";

export default {
  key: "testrail-list-results",
  name: "List Results",
  description: "List recorded results, newest first: either the full result history of ONE test (`testId` — failure comments, defects, who changed what) or all results across a run (`runId`). Use after **List Tests** to read why a test failed before triaging; each result has `status_id`, `comment`, `defects`, `created_on`, `created_by`. Provide exactly one of `testId` or `runId`. Example: testId=5012 → returns [{id: 900, status_id: 5, comment: \"Voltage alarm did not trigger within 5s\", defects: null}]. A run-wide listing can be large: filter with `statusIds` and page with `next_offset`. [See the documentation](https://support.testrail.com/hc/en-us/articles/7077819312404-Results)",
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
      description: "Results for this single test. Use **List Tests** to find it. Set this OR `runId`.",
      optional: true,
    },
    runId: {
      type: "integer",
      label: "Run ID",
      description: "Results for every test in this run. Use **List Runs** to find it. Set this OR `testId`.",
      optional: true,
    },
    statusIds: {
      type: "integer[]",
      label: "Status IDs",
      description: "Only results with one of these status ids, e.g. `[5]` for Failed. See **List Metadata** (kind=statuses).",
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
    if (!this.testId === !this.runId) {
      throw new Error("Provide exactly one of testId or runId");
    }
    const limit = this.limit ?? 100;
    const params = {
      status_id: this.statusIds?.length
        ? this.statusIds
        : undefined,
      limit,
      offset: this.offset,
    };
    const response = this.testId
      ? await this.app.getResults({
        $,
        testId: this.testId,
        params,
      })
      : await this.app.getResultsForRun({
        $,
        runId: this.runId,
        params,
      });
    const page = toPage(response, "results", {
      offset: this.offset ?? 0,
      limit,
    });
    $.export("$summary", `Found ${page.count} result(s)`);
    return page;
  },
};
