import app from "../../proworkflow.app.mjs";

export default {
  key: "proworkflow-add-project-task",
  name: "Add Project Task",
  description: "Adds a project task. [See the docs](https://api.proworkflow.net/?documentation#gettingstartedpostsingle).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
