import komos from "../../komos.app.mjs";

export default {
  key: "komos-list-task-runs",
  name: "List Task Runs",
  description: "Return the run history for a Komos task (up to 50 runs). [See the documentation](https://docs.komos.ai/api-reference/task-runs/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    komos,
    taskId: {
      propDefinition: [
        komos,
        "taskId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.komos.listTaskRuns({
      $,
      taskId: this.taskId,
    });

    const count = response.runs?.length ?? 0;
    $.export("$summary", `Retrieved ${count} task run${count === 1
      ? ""
      : "s"} for task ${this.taskId}`);
    return response;
  },
};
