import twin from "../../twin.app.mjs";

export default {
  key: "twin-get-task-details",
  name: "Get Task Details",
  description: "Retrieve details of a specific task. [See the documentation](https://docs.twin.so/api-reference/endpoint/get-task)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    twin,
    taskId: {
      propDefinition: [
        twin,
        "taskId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.twin.getTask({
      $,
      taskId: this.taskId,
    });
    $.export("$summary", `Successfully retrieved details for task with ID: ${this.taskId}`);
    return response;
  },
};
