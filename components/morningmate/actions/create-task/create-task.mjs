import morningmate from "../../morningmate.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "morningmate-create-task",
  name: "Create Task",
  description: "Creates a new task on a specific project. [See the documentation](https://api.morningmate.com/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    morningmate,
    projectId: {
      propDefinition: [
        morningmate,
        "projectId",
      ],
    },
    taskTitle: {
      propDefinition: [
        morningmate,
        "taskTitle",
      ],
    },
    taskDescription: {
      propDefinition: [
        morningmate,
        "taskDescription",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.morningmate.createTask({
      projectId: this.projectId,
      taskTitle: this.taskTitle,
      taskDescription: this.taskDescription,
    });
    $.export("$summary", `Successfully created task: ${this.taskTitle}`);
    return response;
  },
};
