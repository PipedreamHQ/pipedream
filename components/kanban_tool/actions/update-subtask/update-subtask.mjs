import app from "../../kanban_tool.app.mjs";

export default {
  key: "kanban_tool-update-subtask",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Update Subtask(Checklist Item)",
  description: "Updates a subtask with the given parameters [See the docs here](https://kanbantool.com/developer/api-v3#updating-subtasks)",
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
    name: {
      propDefinition: [
        app,
        "name",
      ],
      optional: true,
    },
    boardUserId: {
      propDefinition: [
        app,
        "boardUserId",
        (configuredProps) => ({
          boardId: configuredProps.boardId,
        }),
      ],
    },
    isCompleted: {
      propDefinition: [
        app,
        "isCompleted",
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.app.updateSubtask({
      $,
      subtaskId: this.subtaskId,
      data: {
        name: this.name,
        assigned_user_id: this.boardUserId,
        is_completed: this.isCompleted,
      },
    });
    $.export("$summary", `The subtask(ID: ${resp.id}) has been updated.`);
    return resp;
  },
};
