import agileCrm from "../../agile_crm.app.mjs";

export default {
  key: "agile_crm-create-task",
  name: "Create Task",
  description: "Create a new task in Agile CRM. [See the documentation](https://github.com/agilecrm/rest-api#54-create-a-task)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    agileCrm,
    subject: {
      propDefinition: [
        agileCrm,
        "subject",
      ],
    },
    type: {
      propDefinition: [
        agileCrm,
        "type",
      ],
    },
    priority: {
      propDefinition: [
        agileCrm,
        "taskPriority",
      ],
    },
    status: {
      propDefinition: [
        agileCrm,
        "taskStatus",
      ],
    },
    description: {
      propDefinition: [
        agileCrm,
        "description",
      ],
    },
    contacts: {
      propDefinition: [
        agileCrm,
        "contact",
      ],
      type: "string[]",
      label: "Contacts",
      description: "Contacts for the new task",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      subject: this.subject,
      type: this.type,
      priority_type: this.priority,
      status: this.status,
      taskDescription: this.description,
      contacts: this.contacts,
    };

    const response = await this.agileCrm.createTask({
      data,
      $,
    });

    $.export("$summary", `Successfully created task with ID ${response.id}`);

    return response;
  },
};
