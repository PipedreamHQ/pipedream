import app from "../../less_annoying_crm.app.mjs";

export default {
  key: "less_annoying_crm-create-task",
  name: "Create Task",
  description: "Creates a task (e.g. a follow-up) in Less Annoying CRM, optionally attached to a contact, company, or lead's contact."
    + " Use for \"remind me to follow up with X on Friday\" requests: find the `contactId` with **Search Contacts**, convert the relative date to an absolute `dueDate` of `YYYY-MM-DD`."
    + " The task is assigned to the API key's owner unless `assignedTo` (a user ID from **List Users**) is given."
    + " `dueDate` is a date only, with no time or timezone. Returns the new `TaskId`."
    + " Example: `taskName: \"Follow up on proposal\", dueDate: \"2025-08-01\", contactId: \"1234567890123456789012345678901\"` returns `{\"TaskId\": \"1234567890123456789012345678906\"}`."
    + " [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Core_Functions/Tasks#Goto-CreateTask)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    taskName: {
      type: "string",
      label: "Task Name",
      description: "Short task title, e.g. `Follow up on proposal`.",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Date the task is due, as `YYYY-MM-DD`, e.g. `2026-11-15`.",
      optional: true,
    },
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
      description: "Contact or company to attach the task to (a long numeric string, e.g. `4135054762542398391286410820683`). Use **Search Contacts** to find the ID.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Extra details for the task, e.g. `Send the revised quote and confirm the delivery date`. Can be multi-line.",
      optional: true,
    },
    assignedTo: {
      propDefinition: [
        app,
        "assignedTo",
      ],
      description: "User ID to assign the task to (a numeric string, e.g. `1240220`). Use **List Users** to find IDs. Defaults to the API key's owner.",
    },
  },
  async run({ $ }) {
    const response = await this.app.createTask({
      $,
      parameters: {
        Name: this.taskName,
        DueDate: this.dueDate,
        ContactId: this.contactId,
        Description: this.description,
        AssignedTo: this.assignedTo,
      },
    });

    $.export("$summary", `Created task "${this.taskName}" (${response.TaskId})`);
    return response;
  },
};
