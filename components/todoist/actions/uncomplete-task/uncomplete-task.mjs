import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-uncomplete-task",
  name: "Uncomplete Task",
  description: "Uncompletes a task [See the docs here](https://developer.todoist.com/rest/v1/#reopen-a-task)",
  version: "0.0.1",
  type: "action",
  props: {
    todoist,
    taskId: {
      propDefinition: [
        todoist,
        "taskId",
      ],
    },
  },
  async run ({ $ }) {
    const { taskId } = this;
    // No interesting data is returned from Hubspot
    await this.todoist.reopenTask({
      $,
      params: {
        taskId,
      },
    });
    $.export("$summary", "Successfully reopened task");
  },
};
