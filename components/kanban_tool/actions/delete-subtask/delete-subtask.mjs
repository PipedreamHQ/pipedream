import app from "../../kanban_tool.app.mjs";

export default {
  key: "kanban_tool-delete-subtask",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Delete Subtask(Checklist Item)",
  description: "Soft deletes a subtask [See the docs here](https://kanbantool.com/developer/api-v3#deleting-subtasks)",
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
    subtaskId: {
      propDefinition: [
        app,
        "subtaskId",
        (configuredProps) => ({
          taskId: configuredProps.taskId,
        }),
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.app.deleteSubtask({
      $,
      subtaskId: this.subtaskId,
    });
    $.export("$summary", `The subtask(ID: ${resp.id}) has been deleted.`);
    return resp;
  },
};
