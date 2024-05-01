import flipando from "../../flipando.app.mjs";

export default {
  key: "flipando-get-task",
  name: "Get Task",
  description: "Fetches data related to a specific task that is currently executed or had been executed previously. [See the documentation](https://flipandoai.notion.site/flipando-ai-api-integration-guide-6b508cfe1a5d4a249d20b926eac3a1d7)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    flipando,
    taskId: {
      propDefinition: [
        flipando,
        "taskId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.flipando.getTask({
      taskId: this.taskId,
    });
    $.export("$summary", `Successfully fetched task ${this.taskId}`);
    return response;
  },
};
