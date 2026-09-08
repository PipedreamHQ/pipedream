import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-create-task",
  name: "Create Task",
  description: "Create a task tied to an OpenPhone conversation. Example: call with conversationId=\"CN123abc\", title=\"Follow up with customer re: onboarding\", description=\"Customer asked about pricing tiers.\" → returns the created task record, including its `id`. Use **List Conversations** or **List Messages** to find the `conversationId`. [See the documentation](https://www.openphone.com/docs/api-reference/tasks/create-a-task)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    openphone,
    conversationId: {
      propDefinition: [
        openphone,
        "conversationId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The task title (e.g. `Follow up with customer re: onboarding`).",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Task description/details. Required by the API.",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Optional due date as an ISO 8601 date-time (e.g. `2026-08-20T00:00:00Z`).",
      optional: true,
    },
    assignedTo: {
      type: "string",
      label: "Assigned To",
      description: "Optional OpenPhone user ID (format `US...`) to assign the task to. Run the **List Users** action to find user IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.openphone.createTask({
      $,
      data: {
        conversationId: this.conversationId,
        title: this.title,
        description: this.description,
        dueDate: this.dueDate,
        assignedTo: this.assignedTo,
      },
    });
    $.export("$summary", `Created task "${this.title}" with ID: ${response.data?.taskId}`);
    return response;
  },
};
