import app from "../../figranium.app.mjs";

export default {
  key: "figranium-execute-task",
  name: "Execute Task",
  description: "Run a saved task and return its result. [See the documentation](https://figranium.com/docs/api-authentication-and-secure-access).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    taskId: {
      propDefinition: [
        app,
        "taskId",
      ],
    },
    variables: {
      type: "object",
      label: "Variables",
      description: "Key-value pairs passed into the task at runtime, e.g. `{ \"targetUrl\": \"https://example.com\", \"dryRun\": true }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app, taskId, variables,
    } = this;

    const response = await app.executeTask({
      $,
      taskId,
      data: {
        variables: variables || {},
      },
    });

    $.export("$summary", `Successfully executed task \`${taskId}\`.`);
    return response;
  },
};
