import github from "../../github.app.mjs";

export default {
  key: "github-get-workflow-run",
  name: "Get Workflow Run",
  description: "Gets a specific workflow run. [See the documentation](https://docs.github.com/en/rest/actions/workflow-runs?apiVersion=2022-11-28#get-a-workflow-run)",
  version: "0.0.6",
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
    workflowRunId: {
      propDefinition: [
        github,
        "workflowRunId",
        ({ repoFullname }) => ({
          repoFullname,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.github.getWorkflowRun({
      repoFullname: this.repoFullname,
      workflowRunId: this.workflowRunId,
    });

    $.export("$summary", `Successfully retrieved the workflow run with Id: ${this.workflowRunId}!.`);

    return response;
  },
};
