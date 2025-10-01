import app from "../../kanban_tool.app.mjs";

export default {
  key: "kanban_tool-move-task",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Move Task",
  description: "Moves a task [See the docs here](https://kanbantool.com/developer/api-v3#updating-tasks)",
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
    swimlaneId: {
      propDefinition: [
        app,
        "swimlaneId",
        (configuredProps) => ({
          boardId: configuredProps.boardId,
        }),
      ],
      description: "Swimlane ID where the task will be moved to",
    },
    stageId: {
      propDefinition: [
        app,
        "stageId",
        (configuredProps) => ({
          boardId: configuredProps.boardId,
        }),
      ],
      description: "Stage ID where the task will be moved to",
    },
  },
  async run ({ $ }) {
    const resp = await this.app.updateTask({
      $,
      taskId: this.taskId,
      data: {
        swimlane_id: this.swimlaneId,
        workflow_stage_id: this.stageId,
      },
    });
    $.export("$summary", `The task(ID: ${resp.id}) has been moved.`);
    return resp;
  },
};
