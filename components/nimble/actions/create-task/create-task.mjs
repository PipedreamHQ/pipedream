import app from "../../nimble.app.mjs";

export default {
  name: "Create Task",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "nimble-create-task",
  description: "Creates a task. [See the documentation](https://nimble.readthedocs.io/en/latest/activities/tasks/create/)",
  type: "action",
  props: {
    app,
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject (short description) of new task",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Any additional text (notes) for task.",
    },
    relatedTo: {
      type: "string[]",
      propDefinition: [
        app,
        "contactId",
      ],
    },
    dueDate: {
      type: "string",
      label: "Due date",
      description: "Due date of the task, i.e. `2013-04-04T13:50:00`",
    },
  },
  async run({ $ }) {
    const response = await this.app.createTask({
      $,
      data: {
        subject: this.subject,
        related_to: this.relatedTo,
        due_date: this.dueDate,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created task with ID \`${response.id}\``);
    }

    return response;
  },
};
