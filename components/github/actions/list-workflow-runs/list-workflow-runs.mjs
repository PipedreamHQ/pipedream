import github from "../../github.app.mjs";

export default {
  key: "github-list-workflow-runs",
  name: "List Workflow Runs",
  description: "List workflowRuns for a repository [See the documentation](https://docs.github.com/en/rest/actions/workflow-runs?apiVersion=2022-11-28#list-workflow-runs-for-a-repository)",
  version: "0.0.5",
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
        "repoFullname",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum quantity to be returned.",
      default: 100,
    },
  },
  async run({ $ }) {
    let page = 1;
    const perPage = 100;
    let allWorkflowRuns = [];
    let count = 0;

    while (count < this.limit) {
      const { workflow_runs: workflowRuns } = await this.github.listWorkflowRuns({
        repoFullname: this.repoFullname,
        perPage: perPage,
        page: page,
      });

      if (workflowRuns.length === 0) {
        break;
      }

      allWorkflowRuns = allWorkflowRuns.concat(workflowRuns);
      count += workflowRuns.length;
      page += 1;
    }

    $.export("$summary", `Successfully retrieved ${allWorkflowRuns.length} workflow runs.`);

    return allWorkflowRuns;
  },
};
