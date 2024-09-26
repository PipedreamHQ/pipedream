import app from "../../teamcamp.app.mjs";

export default {
  key: "teamcamp-create-task",
  name: "Create Task",
  description: "Create a new task in the Project. [See the documentation](https://api.teamcamp.app/api-reference/task/createTask)",
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
    dueDate: {
      propDefinition: [
        app,
        "dueDate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createTask({
      $,
      data: {
        projectId: this.projectId,
        taskName: this.taskName,
        description: this.description,
        dueDate: this.dueDate,
      },
    });

    $.export("$summary", `Successfully created task with ID '${response.taskId}'`);

    return response;
  },
};
