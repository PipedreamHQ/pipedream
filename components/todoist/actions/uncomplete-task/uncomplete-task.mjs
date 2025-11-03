import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-uncomplete-task",
  name: "Uncomplete Task",
  description: "Uncompletes a task. [See the docs here](https://developer.todoist.com/rest/v2/#reopen-a-task)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    todoist,
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
    },
    taskId: {
      propDefinition: [
        todoist,
        "completedTask",
        (c) => ({
          project: c.project,
        }),
      ],
    },
  },
  async run ({ $ }) {
    const { taskId } = this;
    // No interesting data is returned from Todoist
    await this.todoist.reopenTask({
      $,
      params: {
        taskId,
      },
    });
    $.export("$summary", "Successfully reopened task");
    return {
      id: taskId,
      success: true,
    };
  },
};
