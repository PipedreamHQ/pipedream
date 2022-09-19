import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-delete-task",
  name: "Delete Task",
  description: "Deletes a task. [See the docs here](https://developer.todoist.com/rest/v1/#delete-a-task)",
  version: "0.0.1",
  type: "action",
  props: {
    todoist,
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
    },
    task: {
      propDefinition: [
        todoist,
        "task",
        (c) => ({
          project: c.project,
        }),
      ],
      description: "Select the task to delete",
    },
  },
  async run ({ $ }) {
    const { task } = this;
    const data = {
      taskId: task,
    };
    // No interesting data is returned from Todoist
    await this.todoist.deleteTask({
      $,
      data,
    });
    $.export("$summary", "Successfully deleted task");
    return {
      id: task,
      success: true,
    };
  },
};
