import sevenTodosApp from "../../seventodos.app.mjs";

export default {
  key: "seventodos-create-task",
  name: "Create a task",
  description: "Create a task. [See the docs](https://www.7todos.com/app/api).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sevenTodosApp,
    title: {
      propDefinition: [
        sevenTodosApp,
        "title",
      ],
    },
    description: {
      propDefinition: [
        sevenTodosApp,
        "description",
      ],
    },
    startDate: {
      propDefinition: [
        sevenTodosApp,
        "startDate",
      ],
    },
    dueDate: {
      propDefinition: [
        sevenTodosApp,
        "dueDate",
      ],
    },
    state: {
      propDefinition: [
        sevenTodosApp,
        "state",
      ],
    },
    complexity: {
      propDefinition: [
        sevenTodosApp,
        "complexity",
      ],
    },
  },
  async run({ $ }) {
    const {
      title,
      description,
      startDate,
      dueDate,
      state,
      complexity,
    } = this;

    const param = {
      title,
      description,
      startDate,
      dueDate,
      state,
      complexity,
    };

    const task = await this.sevenTodosApp.createTask(param);
    $.export("$summary", `Successfully created task ${task.id}`);
    return task;
  },
};
