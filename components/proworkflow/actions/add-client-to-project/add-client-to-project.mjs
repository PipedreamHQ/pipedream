import app from "../../proworkflow.app.mjs";

export default {
  key: "proworkflow-add-client-to-project",
  name: "Add Client to Project",
  description: "Adds a client to a project. [See the docs](https://api.proworkflow.net/?documentation#gettingstartedpostsingle).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
