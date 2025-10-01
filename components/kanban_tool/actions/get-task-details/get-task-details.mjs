import app from "../../kanban_tool.app.mjs";

export default {
  key: "kanban_tool-get-task-details",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Get Task Details",
  description: "Gets details of a selected task [See the docs here](https://kanbantool.com/developer/api-v3#fetching-tasks)",
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
    const resp = await this.app.getTask({
      $,
      taskId: this.taskId,
    });
    $.export("$summary", `The task(ID: ${resp.id}) details has been retreived.`);
    return resp;
  },
};
