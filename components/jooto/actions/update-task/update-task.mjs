import app from "../../jooto.app.mjs";

export default {
  key: "jooto-update-task",
  name: "Update Task",
  description: "Update a new task in the selected project. [See the documentation](https://www.jooto.com/api/reference/request/#/default/patch-boards-id-tasks-task_id)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        app,
        "taskId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    listId: {
      propDefinition: [
        app,
        "listId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    taskName: {
      propDefinition: [
        app,
        "taskName",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.updateTask({
      $,
      id: this.projectId,
      task_id: this.taskId,
      data: {
        name: this.taskName,
        description: this.description,
        list_id: this.listId,
        assigned_user_ids: this.userId,
      },
    });

    $.export("$summary", `Successfully updated task with ID: '${response.id}'`);

    return response;
  },
};
