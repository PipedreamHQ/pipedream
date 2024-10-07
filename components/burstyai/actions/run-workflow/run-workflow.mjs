import burstyai from "../../burstyai.app.mjs";

export default {
  key: "burstyai-run-workflow",
  name: "Run Workflow",
  description: "Triggers an AI workflow on BurstyAI. The specific workflow to run and optional parameters for the workflow can be configured. [See the documentation](https://burstyai.readme.io/reference)",
  version: "0.0.1",
  type: "action",
  props: {
    burstyai,
    workflow: {
      propDefinition: [
        burstyai,
        "workflow",
      ],
    },
    parameters: {
      propDefinition: [
        burstyai,
        "parameters",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.burstyai.triggerWorkflow({
      workflow: this.workflow,
      parameters: this.parameters,
    });
    $.export("$summary", `Successfully triggered workflow ${this.workflow}`);
    return response;
  },
};
