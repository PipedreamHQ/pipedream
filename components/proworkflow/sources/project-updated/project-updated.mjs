import app from "../../proworkflow.app.mjs";

export default {
  key: "proworkflow-project-updated",
  name: "Project Updated",
  description: "Emit new event when a project is updated. [See the docs](https://api.proworkflow.net/?documentation#gettingstartedgetfields).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
