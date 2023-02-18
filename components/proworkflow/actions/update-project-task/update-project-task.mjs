import app from "../../proworkflow.app.mjs";

export default {
  key: "proworkflow-update-project-task",
  name: "Update Project Task",
  description: "Updates a project task. [See the docs](https://api.proworkflow.net/?documentation#gettingstartedputsingle).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
