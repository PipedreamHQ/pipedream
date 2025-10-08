import app from "../../kanban_tool.app.mjs";

export default {
  key: "kanban_tool-update-task",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Update Task",
  description: "Updates a task with the given parameters [See the docs here](https://kanbantool.com/developer/api-v3#updating-tasks)",
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
      optional: true,
    },
    description: {
      propDefinition: [
        app,
        "description",
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
    },
    stageId: {
      propDefinition: [
        app,
        "stageId",
        (configuredProps) => ({
          boardId: configuredProps.boardId,
        }),
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
    priority: {
      propDefinition: [
        app,
        "priority",
      ],
      optional: false,
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
    timeEstimate: {
      propDefinition: [
        app,
        "timeEstimate",
      ],
    },
    dueDate: {
      propDefinition: [
        app,
        "dueDate",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.app.updateTask({
      $,
      taskId: this.taskId,
      data: {
        name: this.name,
        description: this.description,
        swimlane_id: this.swimlaneId,
        workflow_stage_id: this.stageId,
        assigned_user_id: this.boardUserId,
        priority: parseInt(this.priority),
        tags: this.tags?.join(","),
        time_estimate: this.timeEstimate,
        due_date: this.dueDate,
      },
    });
    $.export("$summary", `The task(ID: ${resp.id}) has been updated successfully.`);
    return resp;
  },
};
