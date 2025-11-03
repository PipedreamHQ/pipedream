import app from "../../kanban_tool.app.mjs";

export default {
  key: "kanban_tool-create-subtask",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Subtask(Checklist Item)",
  description: "Creates a subtask [See the docs here](https://kanbantool.com/developer/api-v3#creating-subtasks)",
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
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    taskVersion: {
      propDefinition: [
        app,
        "taskVersion",
      ],
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
    position: {
      propDefinition: [
        app,
        "position",
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
    const resp = await this.app.createSubtask({
      $,
      data: {
        board_id: this.boardId,
        task_id: this.taskId,
        name: this.name,
        task_version: this.taskVersion,
        assigned_user_id: this.boardUserId,
        position: this.position,
        is_completed: this.isCompleted,
      },
    });
    $.export("$summary", `The subtask(ID: ${resp.id}) has been created successfully.`);
    return resp;
  },
};
