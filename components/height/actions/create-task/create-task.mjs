import height from "../../height.app.mjs";

export default {
  key: "height-create-task",
  name: "Create Task",
  description: "Creates a new task within your workspace",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    height,
    taskName: {
      propDefinition: [
        height,
        "taskName",
      ],
    },
    description: {
      propDefinition: [
        height,
        "description",
      ],
      optional: true,
    },
    deadline: {
      propDefinition: [
        height,
        "deadline",
      ],
      optional: true,
    },
    priority: {
      propDefinition: [
        height,
        "priority",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.height.createTask(this.taskName, this.description, this.deadline, this.priority);
    $.export("$summary", `Successfully created task ${this.taskName}`);
    return response;
  },
};
