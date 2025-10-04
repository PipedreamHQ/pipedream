import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-get-task",
  name: "Get Task",
  description: "Returns info about a task. [See the docs here](https://developer.todoist.com/rest/v2/#get-an-active-task)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    task: {
      propDefinition: [
        todoist,
        "task",
        (c) => ({
          project: c.project,
        }),
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.todoist.getActiveTasks({
      $,
      params: {
        task_id: this.task,
      },
    });
    $.export("$summary", "Successfully retrieved task");
    return resp;
  },
};
