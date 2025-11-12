import app from "../../browse_ai.app.mjs";

export default {
  key: "browse_ai-execute-task",
  name: "Execute Task",
  description: "Runs a robot on-demand with custom input parameters. [See the documentation](https://www.browse.ai/docs/api/v2#tag/tasks/operation/newRobotTask)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    robotId: {
      propDefinition: [
        app,
        "robotId",
      ],
    },
    inputParameters: {
      propDefinition: [
        app,
        "inputParameters",
      ],
    },
  },
  methods: {
    runTask({
      robotId, ...args
    }) {
      return this.app.post({
        path: `/robots/${robotId}/tasks`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      runTask,
      robotId,
      inputParameters,
    } = this;

    const response = await runTask({
      $,
      robotId,
      data: {
        inputParameters,
      },
    });
    $.export("$summary", `Successfully executed task with ID: \`${response.result.id}\``);
    return response;
  },
};
