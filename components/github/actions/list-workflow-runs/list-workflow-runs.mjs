import github from "../../github.app.mjs";

export default {
  key: "github-list-workflow-runs",
  name: "List Workflow Runs",
  description: "List GitHub Actions workflow runs for a repository, most recent first. Optionally filter by `branch` or `status` (e.g. `completed`, `in_progress`, `failure`, `success`). Returns each run's `id`, workflow name, `status`, `conclusion`, branch, and timestamps. Use this to triage CI — find a failing run, then pass its `id` to **Get Workflow Run** for job details or to **Run Workflow** to re-run its failed jobs. Provide the repository as an `owner/repo` string. [See the documentation](https://docs.github.com/en/rest/actions/workflow-runs#list-workflow-runs-for-a-repository)",
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
    branch: {
      type: "string",
      label: "Branch",
      description: "Only return runs associated with this branch, e.g. `main`.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter runs by status or conclusion.",
      options: [
        "queued",
        "in_progress",
        "completed",
        "success",
        "failure",
        "cancelled",
        "skipped",
        "timed_out",
        "action_required",
      ],
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of workflow runs to return. Defaults: `100`",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);

    let page = 1;
    const perPage = 100;
    let runs = [];

    while (runs.length < this.maxResults) {
      const { workflow_runs: workflowRuns } = await this.github.listWorkflowRuns({
        repoFullname,
        perPage,
        page,
        branch: this.branch,
        status: this.status,
      });

      if (!workflowRuns?.length) {
        break;
      }

      runs = runs.concat(workflowRuns);
      page += 1;
    }

    runs = runs.slice(0, this.maxResults);

    $.export("$summary", `Successfully retrieved ${runs.length} workflow run(s)`);

    return runs;
  },
};
