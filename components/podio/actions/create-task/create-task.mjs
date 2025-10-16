import app from "../../podio.app.mjs";

export default {
  type: "action",
  key: "podio-create-task",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Task",
  description: "Creates a task to the given workspace. [See the documentation](https://developers.podio.com/doc/tasks/create-task-22419)",
  props: {
    app,
    text: {
      type: "string",
      label: "Text",
      description: "The text of the task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task",
      optional: true,
    },
    responsible: {
      type: "integer[]",
      label: "Responsible",
      description: "The contact id(s) responsible for the task",
      optional: true,
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "The list of labels in text form",
      optional: true,
    },
    reminder: {
      propDefinition: [
        app,
        "reminder",
      ],
    },
  },
  async run ({ $ }) {
    const reminder = this.reminder ?
      {
        remind_delta: this.reminder,
      } :
      this.reminder;
    const resp = await this.app.createTask({
      $,
      data: {
        text: this.text,
        description: this.description,
        responsible: this.responsible,
        labels: this.labels,
        reminder,
      },
    });
    $.export("$summary", `The task has been created. (ID:${resp.task_id})`);
    return resp;
  },
};
