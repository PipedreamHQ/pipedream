import app from "../../paymo.app.mjs";

export default {
  key: "paymo-find-task",
  name: "Find Task",
  description: "Finds a task. [See the docs](https://github.com/paymoapp/api/blob/master/sections/tasks.md#list).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the task.",
      optional: true,
    },
    projectId: {
      optional: true,
      propDefinition: [
        app,
        "projectId",
      ],
    },
  },
  async run({ $: step }) {
    const {
      name,
      projectId,
    } = this;

    const response = await this.app.listTasks({
      path: "/tasks",
      step,
      params: {
        ["where=project_id"]: projectId,
      },
    });

    let tasksFound = response.tasks;
    if (name) {
      tasksFound = tasksFound
        .filter(({ name: taskName }) => taskName.toLowerCase()
          .includes(name.toLowerCase()));
    }

    if (tasksFound.length) {
      step.export("$summary", `Successfully found ${tasksFound.length} task(s) with name \`${name}\``);
    } else {
      step.export("$summary", `No tasks found with name \`${name}\``);
    }

    return tasksFound;
  },
};
