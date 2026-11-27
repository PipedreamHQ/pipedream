import app from "../../lambdatest.app.mjs";

export default {
  key: "lambdatest-get-job-status",
  name: "Get Job Status",
  description: "Retrieve the status of a HyperExecute job and its tasks, such as a job started by **Run Test Run**. [See the documentation](https://www.testmuai.com/support/api-doc/hyperexecute/jobs/check-the-status-of-a-job-and-its-associated-tasks/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the HyperExecute job, e.g. `79078ec2-2f45-4ec5-8adf-4aabfcdeef8e`. **Run Test Run** returns it as `job_id`.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getJob({
      $,
      jobId: this.jobId,
    });

    $.export("$summary", `Job ${this.jobId} is ${response.data?.status}`);

    return response;
  },
};
