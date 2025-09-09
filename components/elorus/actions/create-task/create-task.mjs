import app from "../../elorus.app.mjs";

export default {
  key: "elorus-create-task",
  name: "Create Task",
  description: "Create a new task in Elorus. [See the documentation](https://developer.elorus.com/#operation/tasks_create)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    hourlyRate: {
      propDefinition: [
        app,
        "hourlyRate",
      ],
    },
    project: {
      propDefinition: [
        app,
        "project",
      ],
    },
    active: {
      propDefinition: [
        app,
        "active",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createTask({
      $,
      data: {
        name: this.name,
        description: this.description,
        hourly_rate: this.hourlyRate,
        project: this.project,
        active: this.active,
      },
    });
    $.export("$summary", "Successfully created the task with id: " + response.id);
    return response;
  },
};
