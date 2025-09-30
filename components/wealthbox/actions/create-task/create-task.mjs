import wealthbox from "../../wealthbox.app.mjs";

export default {
  key: "wealthbox-create-task",
  name: "Create Task",
  description: "Create a new task. [See the documentation](http://dev.wealthbox.com/#tasks-collection-post)",
  version: "0.0.2",
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
      label: "Name",
      description: "The name of the task being created",
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
    descripton: {
      type: "string",
      label: "Description",
      description: "A short explaination of the task being created",
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
