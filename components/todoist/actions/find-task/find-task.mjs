import todoist from "../../todoist.app.mjs";

export default {
  key: "todoist-find-task",
  name: "Find Task",
  description: "Finds a task by name. [See Docs](https://developer.todoist.com/rest/v2/#get-active-tasks) Optionally, create one if none are found. [See Docs](https://developer.todoist.com/rest/v2/#create-a-new-task)",
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
    const tasks = await this.todoist.getActiveTasks({
      $,
      params: {
        project_id: project,
      },
    });
    let result = tasks.find((task) => task.content == content);
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
