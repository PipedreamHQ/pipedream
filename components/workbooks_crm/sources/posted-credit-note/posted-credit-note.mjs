import app from "../../workbooks_crm.app.mjs";

export default {
  key: "workbooks_crm-posted-credit-note",
  name: "Posted Credit Note",
  description: "Emit new event when a new credit note is posted.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
