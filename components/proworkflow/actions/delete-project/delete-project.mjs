import app from "../../proworkflow.app.mjs";

export default {
  key: "proworkflow-delete-project",
  name: "Delete Project",
  description: "Deletes a project. [See the docs](https://api.proworkflow.net/?documentation#gettingstarteddeletesingle).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
