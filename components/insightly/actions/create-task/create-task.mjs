import insightly from "../../insightly.app.mjs";

export default {
  key: "insightly-create-task",
  name: "Create Task",
  description: "Creates a new task. [See documentation](https://api.insightly.com/v3.1/Help?#!/Tasks/AddEntity)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    insightly,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the task.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the task.",
      options: [
        "Not Started",
        "In Progress",
        "Completed",
        "Deferred",
        "Waiting",
      ],
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the task in YYYY-mm-dd format. For example, 2023-08-20",
    },
    categoryId: {
      propDefinition: [
        insightly,
        "categoryId",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      TITLE: this.title,
      STATUS: this.status,
      DUE_DATE: this.dueDate,
      CATEGORY_ID: this.categoryId,
    };

    const response = await this.insightly.createTask({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created task with ID ${response.TASK_ID}.`);
    }

    return response;
  },
};
