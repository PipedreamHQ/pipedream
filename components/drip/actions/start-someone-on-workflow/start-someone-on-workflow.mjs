import drip from "../../drip.app.mjs";

export default {
  key: "drip-start-someone-on-workflow",
  name: "Start Someone on a Workflow",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "If the workflow is not active, the subscriber will not be added to the workflow. [See the docs here](https://developer.drip.com/#start-someone-on-a-workflow)",
  type: "action",
  props: {
    drip,
    email: {
      propDefinition: [
        drip,
        "email",
      ],
      optional: false,
    },
    workflowId: {
      propDefinition: [
        drip,
        "workflowId",
      ],
      withLabel: true,
    },
  },
  async run({ $ }) {
    const email = this.email.label || this.email;
    const workflowId = this.workflowId.value || this.workflowId;
    const workflow = this.workflowId.label || this.workflowId;

    const response = await this.drip.startSomeoneOnWorkflow({
      $,
      workflowId,
      email,
    });

    $.export("$summary", `${email} began workflow **${workflow}**`);
    return response;
  },
};
