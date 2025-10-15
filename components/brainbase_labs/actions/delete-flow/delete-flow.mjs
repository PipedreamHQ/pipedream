import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase-delete-flow",
  name: "Delete Flow",
  description: "Delete a flow. [See the documentation](https://docs.usebrainbase.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    workerId: {
      propDefinition: [
        app,
        "workerId",
      ],
    },
    flowId: {
      propDefinition: [
        app,
        "flowId",
        (c) => ({
          workerId: c.workerId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteFlow({
      $,
      workerId: this.workerId,
      flowId: this.flowId,
    });

    $.export("$summary", `Successfully deleted flow with ID ${this.flowId}`);
    return response;
  },
};

