import browse_ai from "../../browse_ai.app.mjs";

export default {
  key: "browse_ai-execute-task",
  name: "Execute Task",
  description: "Runs a robot on-demand with custom input parameters. [See the documentation](https://www.browse.ai/docs/api/v2)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    browse_ai,
    robotId: {
      propDefinition: [
        browse_ai,
        "robotId",
      ],
    },
    inputParameters: {
      propDefinition: [
        browse_ai,
        "inputParameters",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.browse_ai.runRobot({
      robotId: this.robotId,
      inputParameters: this.inputParameters,
    });
    $.export("$summary", `Successfully executed task with ID: ${response.id}`);
    return response;
  },
};
