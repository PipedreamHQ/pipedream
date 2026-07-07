import github from "../../github.app.mjs";

export default {
  key: "github-get-workflow-run",
  name: "Get Workflow Run",
  description: "Get the details of a single GitHub Actions workflow run, including its per-job conclusions and a link to the run's logs. Returns the run's `status`/`conclusion` and timestamps plus a `jobs` array (each job's name, status, conclusion, and `logsUrl`) so you can see exactly which job failed. Provide the repository as an `owner/repo` string and the run ID. Use **List Workflow Runs** to find a run ID, then **Run Workflow** to re-run the failed jobs. [See the documentation](https://docs.github.com/en/rest/actions/workflow-runs#get-a-workflow-run)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullnameStatic",
      ],
    },
    runId: {
      type: "string",
      label: "Run ID",
      description: "The workflow run ID. Use **List Workflow Runs** to find it.",
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const [
      run,
      jobs,
    ] = await Promise.all([
      this.github.getWorkflowRun({
        repoFullname,
        workflowRunId: this.runId,
      }),
      this.github.getWorkflowRunJobs({
        repoFullname,
        workflowRunId: this.runId,
      }),
    ]);

    const jobSummaries = jobs.map((job) => ({
      id: job.id,
      name: job.name,
      status: job.status,
      conclusion: job.conclusion,
      logsUrl: job.html_url,
    }));

    $.export("$summary", `Workflow run ${this.runId}: ${run.status}${run.conclusion
      ? ` / ${run.conclusion}`
      : ""}`);

    return {
      run,
      jobs: jobSummaries,
    };
  },
};
