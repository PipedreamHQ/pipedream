import app from "../../proworkflow.app.mjs";

export default {
  key: "proworkflow-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created. [See the docs](https://api.proworkflow.net/?documentation#gettingstartedgetfields).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
