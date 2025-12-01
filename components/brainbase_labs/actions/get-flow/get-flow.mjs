import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase_labs-get-flow",
  name: "Get Flow",
  description: "Get a single flow by ID. [See the documentation](https://docs.usebrainbase.com/api-reference/flows/get-a-single-flow)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.app.getFlow({
      $,
      workerId: this.workerId,
      flowId: this.flowId,
    });

    $.export("$summary", `Successfully retrieved flow with ID ${this.flowId}`);
    return response;
  },
};
