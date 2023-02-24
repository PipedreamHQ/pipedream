import app from "../../paymo.app.mjs";

export default {
  key: "paymo-find-task",
  name: "Find Task",
  description: "Finds a task. [See the docs](https://github.com/paymoapp/api/blob/master/sections/tasks.md#list).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
