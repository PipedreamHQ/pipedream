import app from "../../proworkflow.app.mjs";

export default {
  key: "proworkflow-new-project-created",
  name: "New Project Created",
  description: "Emit new event when a new project is created. [See the docs](https://api.proworkflow.net/?documentation#gettingstartedgetfields).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
