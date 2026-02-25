import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-get-task",
  name: "Get Task",
  description: "Returns info about a task. [See the documentation](https://developer.todoist.com/api/v1#tag/Tasks/operation/get_task_api_v1_tasks__task_id__get)",
  version: "0.0.6",
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
