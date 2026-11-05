import app from "../../lambdatest.app.mjs";

export default {
  key: "lambdatest-run-test-run",
  name: "Run Test Run",
  description: "Start a KaneAI test run from Test Manager on HyperExecute and return the job ID and job link. [See the documentation](https://www.testmuai.com/support/docs/kaneai-ci-cd-automation/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    testRunId: {
      propDefinition: [
        app,
        "testRunId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
    concurrency: {
      type: "integer",
      label: "Concurrency",
      description: "The number of test instances to run in parallel, e.g. `1`.",
      default: 1,
      min: 1,
      optional: true,
    },
    title: {
      type: "string",
      label: "Job Title",
      description: "The title of the HyperExecute job, e.g. `Nightly sanity run`. A random title is used if left empty.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.runTestRun({
      $,
      data: {
        test_run_id: this.testRunId,
        concurrency: this.concurrency,
        title: this.title,
      },
    });

    $.export("$summary", `Successfully started HyperExecute job ${response.job_id}`);

    return response;
  },
};
