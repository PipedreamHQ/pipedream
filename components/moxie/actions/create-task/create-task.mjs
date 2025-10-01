import moxie from "../../moxie.app.mjs";

export default {
  key: "moxie-create-task",
  name: "Create Task",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new task. [See the documentation](https://help.withmoxie.com/en/articles/8160423-create-task)",
  type: "action",
  props: {
    moxie,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the task",
    },
    clientName: {
      propDefinition: [
        moxie,
        "clientName",
      ],
    },
    projectName: {
      propDefinition: [
        moxie,
        "projectName",
        (c) => ({
          clientName: c.clientName,
        }),
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the task",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The task status",
      optional: true,
      options: [
        "Not started",
        "In progress",
        "Client Approval",
        "Done",
      ],
    },
    assignedTo: {
      type: "string[]",
      label: "Assigned To",
      description: "Array of email addresses to assign to the task",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      description: this.description,
      clientName: this.clientName,
      projectName: this.projectName,
      status: this.status,
      assignedTo: this.assignedTo
        ? this.assignedTo
        : [],
    };

    const response = await this.moxie.createTask({
      data,
      $,
    });

    if (response.id) {
      $.export("$summary", `Successfully created task with ID ${response.id}.`);
    }

    return response;
  },
};
