import app from "../../paymo.app.mjs";

export default {
  key: "paymo-create-task",
  name: "Create Task",
  description: "Creates a task. [See the docs](https://github.com/paymoapp/api/blob/master/sections/tasks.md#create).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
