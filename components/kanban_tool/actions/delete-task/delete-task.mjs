import app from "../../kanban_tool.app.mjs";

export default {
  key: "kanban_tool-delete-task",
  version: "0.0.1",
  type: "action",
  name: "Delete Task",
  description: "Soft deletes a task [See the docs here](https://kanbantool.com/developer/api-v3#deleting-tasks)",
  props: {
    app,
    boardId: {
      propDefinition: [
        app,
        "boardId",
      ],
    },
    taskId: {
      propDefinition: [
        app,
        "taskId",
        (configuredProps) => ({
          boardId: configuredProps.boardId,
        }),
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.app.updateTask({
      $,
      taskId: this.taskId,
      data: {
        _action: "delete",
      },
    });
    $.export("$summary", `The task(ID: ${resp.id}) has been marked as deleted.`);
    return resp;
  },
};
