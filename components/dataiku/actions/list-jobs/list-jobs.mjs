import dataiku from "../../dataiku.app.mjs";

export default {
  key: "dataiku-list-jobs",
  name: "List Jobs",
  description: "Retrieve the latest build jobs of a DSS project, each with its `jobId` and `state`. Use this to check what a project has been building recently, or to recover a `jobId` you no longer have before calling **Get Job Status**. Requires the `READ_CONF` privilege on the project. [See the documentation](https://doc.dataiku.com/dss/api/15/rest/#jobs-jobs-get)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dataiku,
    projectKey: {
      propDefinition: [
        dataiku,
        "projectKey",
      ],
    },
    limit: {
      propDefinition: [
        dataiku,
        "limit",
      ],
      description: "Maximum number of jobs to return, e.g. `20`. Defaults to `0`, which returns every job DSS has retained for the project.",
    },
  },
  async run({ $ }) {
    const response = await this.dataiku.listJobs({
      $,
      projectKey: this.projectKey,
      params: {
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${response?.length} job(s) in project ${this.projectKey}`);
    return response;
  },
};
