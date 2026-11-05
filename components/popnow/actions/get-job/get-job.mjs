import app from "../../popnow.app.mjs";

export default {
  key: "popnow-get-job",
  name: "Get Job",
  description: "Get the current record of a task, including its state, output file URLs and USD cost. Output URLs are signed and valid for about 20 minutes. [See the documentation](https://popnow.ai/docs/tasks)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const response = await this.app.getJob({
      $,
      taskId: this.taskId,
    });
    $.export("$summary", `Task ${this.taskId} is \`${response?.state}\``);
    return response;
  },
};
