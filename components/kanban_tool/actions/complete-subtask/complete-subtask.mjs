import app from "../../kanban_tool.app.mjs";

export default {
  key: "kanban_tool-complete-subtask",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Complete Subtask(Checklist Item)",
  description: "Marks a subtask as completed [See the docs here](https://kanbantool.com/developer/api-v3#updating-subtasks)",
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
    const resp = await this.app.updateSubtask({
      $,
      subtaskId: this.subtaskId,
      data: {
        is_completed: true,
      },
    });
    $.export("$summary", `The subtask(ID: ${resp.id}) has been marked as completed.`);
    return resp;
  },
};
