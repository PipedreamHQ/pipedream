import taiga from "../../taiga.app.mjs";

export default {
  key: "taiga-delete-task",
  name: "Delete Task",
  description: "Delete an existing task from a Taiga project. [See the documentation](https://docs.taiga.io/api.html#tasks-delete)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    taiga,
    projectId: {
      propDefinition: [
        taiga,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        taiga,
        "taskId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.taiga.deleteTask({
      $,
      taskId: this.taskId,
    });

    $.export("$summary", `Deleted task: ${this.taskId}`);
    return response;
  },
};
