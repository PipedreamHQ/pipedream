import app from "../../kanban_tool.app.mjs";

export default {
  key: "kanban_tool-archive-task",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Archive Task",
  description: "Archives a task [See the docs here](https://kanbantool.com/developer/api-v3#archiving-tasks)",
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
        _action: "archive",
      },
    });
    $.export("$summary", `The task(ID: ${resp.id}) has been archived.`);
    return resp;
  },
};
