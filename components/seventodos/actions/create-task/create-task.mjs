import sevenTodosApp from "../../seventodos.app.mjs";
import common from "../common.mjs";

export default {
  key: "seventodos-create-task",
  name: "Create a task",
  description: "Create a task. [See the docs](https://www.7todos.com/app/api).",
  version: "0.0.1",
  type: "action",
  props: {
    sevenTodosApp,
    ...common.props,
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
