import app from "../../workbooks_crm.app.mjs";

export default {
  key: "workbooks_crm-posted-invoice",
  name: "Posted Invoice",
  description: "Emit new event when a new invoice is posted.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
