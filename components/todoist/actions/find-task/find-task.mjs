import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-find-task",
  name: "Find Task",
  description: "Finds a task by name. [See the documentation](https://developer.todoist.com/api/v1#tag/Tasks/operation/get_tasks_api_v1_tasks_get) Optionally, create one if none are found. [See the documentation](https://developer.todoist.com/api/v1#tag/Tasks/operation/create_task_api_v1_tasks_post)",
  version: "0.0.7",
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
    content: {
      propDefinition: [
        todoist,
        "name",
      ],
      description: "The name of the task to search for/create",
    },
    createIfNotFound: {
      propDefinition: [
        todoist,
        "createIfNotFound",
      ],
    },
  },
  async run ({ $ }) {
    const {
      project,
      content,
      createIfNotFound,
    } = this;
    const resp = await this.todoist.getActiveTasks({
      $,
      params: {
        project_id: project,
      },
    });
    let result = resp?.results?.find((task) => task?.content == content);
    let summary = result
      ? "Task found"
      : "Task not found";

    if (!result && createIfNotFound) {
      result = await this.todoist.createTask({
        $,
        data: {
          project_id: project,
          content,
        },
      });
      summary += ", Task created";
    }

    $.export("$summary", summary);
    return result;
  },
};
