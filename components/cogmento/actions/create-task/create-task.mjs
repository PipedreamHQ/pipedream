import cogmento from "../../cogmento.app.mjs";

export default {
  key: "cogmento-create-task",
  name: "Create Task",
  description: "Create a new task in Cogmento CRM. [See the documentation](https://api.cogmento.com/static/swagger/index.html#/Tasks/post_tasks_)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cogmento,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the task",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The task's deadline(format: YYYY-MM-DD)",
      optional: true,
    },
    assigneeIds: {
      propDefinition: [
        cogmento,
        "userIds",
      ],
      description: "An array of user IDs to assign to the task",
      optional: true,
    },
    dealId: {
      propDefinition: [
        cogmento,
        "dealId",
      ],
      optional: true,
    },
    contactId: {
      propDefinition: [
        cogmento,
        "contactId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.cogmento.createTask({
      $,
      data: {
        title: this.title,
        description: this.description,
        due_date: this.dueDate,
        assigned_to: this.assigneeIds?.map((id) => ({
          id,
        })) || undefined,
        deal: this.dealId && {
          id: this.dealId,
        },
        contact: this.contactId && {
          id: this.contactId,
        },
      },
    });
    $.export("$summary", `Successfully created task: ${this.title}`);
    return response;
  },
};
