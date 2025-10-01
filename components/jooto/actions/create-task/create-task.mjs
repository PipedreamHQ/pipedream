import app from "../../jooto.app.mjs";

export default {
  key: "jooto-create-task",
  name: "Create Task",
  description: "Create a new task in the selected project. [See the documentation](https://www.jooto.com/api/reference/request/#/default/post-boards-id-tasks)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
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
    const response = await this.app.createTask({
      $,
      id: this.projectId,
      data: {
        name: this.taskName,
        description: this.description,
        list_id: this.listId,
        assigned_user_ids: this.userId,
      },
    });

    $.export("$summary", `Successfully created task with ID: '${response.id}'`);

    return response;
  },
};
