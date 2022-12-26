import drip from "../../drip.app.mjs";

export default {
  key: "drip-start-someone-on-workflow",
  name: "Start Someone on a Workflow",
  version: "0.0.1",
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
    const {
      email: { label },
      workflowId,
    } = this;

    const response = await this.drip.startSomeoneOnWorkflow({
      $,
      workflowId: workflowId.value,
      email: label,
    });

    $.export("$summary", `${label} began workflow **${workflowId.label}**`);
    return response;
  },
};
