import kadoa from "../../kadoa.app.mjs";

export default {
  key: "kadoa-start-workflow",
  name: "Start Kadoa Workflow",
  description: "Triggers a Kadoa workflow using Pipedream. [See the documentation](https://api.kadoa.com/api-docs/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    kadoa,
    workflowId: {
      propDefinition: [
        kadoa,
        "workflowId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.kadoa.triggerWorkflow({
      $,
      workflowId: this.workflowId,
    });
    $.export("$summary", `Successfully triggered workflow ${this.workflowId}`);
    return response;
  },
};
