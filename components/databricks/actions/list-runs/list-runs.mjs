import databricks from "../../databricks.app.mjs";

export default {
  key: "databricks-list-runs",
  name: "List Runs",
  description: "Lists all runs available to the user. [See the documentation](https://docs.databricks.com/en/workflows/jobs/jobs-2.0-api.html#runs-list)",
  version: "0.0.4",
  type: "action",
  props: {
    databricks,
    jobId: {
      propDefinition: [
        databricks,
        "jobId",
      ],
      optional: true,
    },
    activeOnly: {
      type: "boolean",
      label: "Active Only?",
      description: "Set to true to return only active runs",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of runs to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      job_id: this.jobId,
      active_only: this.activeOnly,
      limit: 100,
      offset: 0,
    };
    const allRuns = [];
    let total = 0;

    do {
      const { runs } = await this.databricks.listRuns({
        params,
        $,
      });
      if (!runs?.length) {
        break;
      }
      allRuns.push(...runs);
      params.offset += params.limit;
      total = runs?.length;
    } while (total === params.limit && allRuns < this.maxResults);

    if (allRuns?.length > this.maxResults) {
      allRuns.length = this.maxResults;
    }

    $.export("$summary", `Successfully retrieved ${allRuns.length} run${allRuns.length === 1
      ? ""
      : "s"}.`);

    return allRuns;
  },
};
