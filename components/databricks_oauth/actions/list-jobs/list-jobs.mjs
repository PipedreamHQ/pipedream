import databricks_oauth from "../../databricks_oauth.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "databricks_oauth-list-jobs",
  name: "List Jobs",
  description: "List all jobs using automatic pagination. [See the documentation](https://docs.databricks.com/api/workspace/jobs/list)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    databricks_oauth,
    expandTasks: {
      type: "boolean",
      label: "Expand Tasks",
      description: "Whether to include task and cluster details in the response",
      optional: true,
    },
    name: {
      type: "string",
      label: "Job Name",
      description: "Optional name to filter on",
      optional: true,
    },
    maxRequests: {
      type: "integer",
      label: "Max Requests",
      description: "Maximum number of API requests to make when paginating",
      optional: true,
      min: 1,
      max: 10,
    },
  },
  async run({ $ }) {
    const {
      databricks_oauth,
      expandTasks,
      name,
      maxRequests,
    } = this;

    const jobs = await databricks_oauth.paginate({
      requestor: databricks_oauth.listJobs,
      maxRequests,
      resultsKey: "jobs",
      requestorArgs: {
        $,
        params: {
          expand_tasks: expandTasks,
          name,
          limit: constants.DEFAULT_LIMIT,
        },
      },
    });

    $.export("$summary", `Successfully retrieved \`${jobs.length}\` job(s)`);

    return jobs;
  },
};
