import flipando from "../../flipando.app.mjs";

export default {
  key: "flipando-get-task",
  name: "Get Task",
  description: "Fetches data related to a specific task that is currently executed or had been executed previously. [See the documentation](https://flipandoai.notion.site/Flipando-ai-API-Integration-Guide-6b508cfe1a5d4a249d20b926eac3a1d7#36b02715e5f440c9b21952b668e0e70c)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    flipando,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to retrieve",
    },
  },
  async run({ $ }) {
    const response = await this.flipando.getTask({
      $,
      taskId: this.taskId,
    });
    $.export("$summary", `Successfully retrieved task ${this.taskId}`);
    return response;
  },
};
