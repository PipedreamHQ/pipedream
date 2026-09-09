import dataiku from "../../dataiku.app.mjs";

export default {
  key: "dataiku-get-job-status",
  name: "Get Job Status",
  description: "Check the status of a DSS build job, returned as `baseStatus.status`. Poll this after **Build Dataset** using the `id` it returned. `NOT_STARTED` and `RUNNING` mean the job is still in flight; `DONE`, `FAILED` and `ABORTED` are terminal, so stop polling on any of them and treat `FAILED`/`ABORTED` as an unsuccessful build. Use **List Jobs** to recover a job ID you no longer have. Requires the `MONITOR_JOBS` privilege on the project. [See the documentation](https://doc.dataiku.com/dss/api/15/rest/#jobs-job-get)",
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
    jobId: {
      propDefinition: [
        dataiku,
        "jobId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataiku.getJob({
      $,
      projectKey: this.projectKey,
      jobId: this.jobId,
    });
    $.export("$summary", `Job ${this.jobId} is in state ${response?.baseStatus?.status}`);
    return response;
  },
};
