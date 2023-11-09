import productiveio from "../../productiveio.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "productiveio-create-task",
  name: "Create Task",
  description: "Creates a new task in Productive. [See the documentation](https://developer.productive.io/tasks.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    productiveio,
    taskDetails: productiveio.propDefinitions.taskDetails,
    projectId: {
      propDefinition: [
        productiveio,
        "projectId",
      ],
    },
    taskListId: {
      propDefinition: [
        productiveio,
        "taskListId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    // Include additional optional parameters as props here if required
  },
  async run({ $ }) {
    const response = await this.productiveio.createTask({
      data: {
        type: "tasks",
        attributes: this.taskDetails,
        relationships: {
          project: {
            data: {
              type: "projects",
              id: this.projectId,
            },
          },
          task_list: {
            data: {
              type: "task_lists",
              id: this.taskListId,
            },
          },
        },
      },
    });

    $.export("$summary", `Successfully created task with ID ${response.id}`);
    return response;
  },
};
