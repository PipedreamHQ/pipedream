import app from "../../workbooks_crm.app.mjs";

export default {
  key: "workbooks_crm-new-person",
  name: "New Person",
  description: "Emit new event when a new person is created.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
