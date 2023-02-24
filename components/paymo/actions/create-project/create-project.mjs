import app from "../../paymo.app.mjs";

export default {
  key: "paymo-create-project",
  name: "Create Project",
  description: "Creates a project. [See the docs](https://github.com/paymoapp/api/blob/master/sections/projects.md#create).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
