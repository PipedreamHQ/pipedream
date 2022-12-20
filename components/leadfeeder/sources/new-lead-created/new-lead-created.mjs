import app from "../../leadfeeder.app.mjs";

export default {
  key: "leadfeeder-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when a new lead is created. [See the docs](https://docs.leadfeeder.com/api/#get-leads)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
