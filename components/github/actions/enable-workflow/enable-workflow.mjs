import github from "../../github.app.mjs";

export default {
  key: "github-enable-workflow",
  name: "Enable Workflow",
  description: "Enables a workflow and sets the **state** of the workflow to **active**. [See the documentation](https://docs.github.com/en/rest/actions/workflows?apiVersion=2022-11-28#enable-a-workflow)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    workflowId: {
      propDefinition: [
        github,
        "workflowId",
        ({ repoFullname }) => ({
          repoFullname,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.github.enableWorkflow({
      repoFullname: this.repoFullname,
      workflowId: this.workflowId,
    });

    $.export("$summary", `Successfully enabled the workflow with Id: ${this.workflowId}!`);

    return response;
  },
};
