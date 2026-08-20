// x-pd-ai: optimized
import wealthbox from "../../wealthbox.app.mjs";

export default {
  key: "wealthbox-create-task",
  name: "Create Task",
  description: "Create a new task in Wealthbox. Supply a task name, due date (`YYYY-MM-DD HH:MM AM/PM ±HHMM`), and optional category and priority. Use **List Category Options** to find valid category IDs. Example: create a task named `Send Q4 Report` due `2026-12-31 5:00 PM -0500` with priority `High`; returns the task object including `id`, `name`, `due_date`, `category`, and `priority`. [See the documentation](https://dev.wealthbox.com/#tasks-retrieve-all-tasks-post)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wealthbox,
    name: {
      type: "string",
      label: "Task Name",
      description: "The name of the task being created. Example: `Send Q4 Report`.",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The time at which the task is due. Example `2015-05-24 11:00 AM -0400`",
    },
    category: {
      propDefinition: [
        wealthbox,
        "taskCategory",
      ],
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "String to indicate the priority of the task you are creating",
      options: [
        "Low",
        "Medium",
        "High",
      ],
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A short explanation of the task being created. Example: `Follow up with client regarding Q4 portfolio allocation.`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.wealthbox.createTask({
      data: {
        name: this.name,
        due_date: this.dueDate,
        category: this.category,
        priority: this.priority,
        description: this.description,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created task with ID ${response.id}`);
    }

    return response;
  },
};
