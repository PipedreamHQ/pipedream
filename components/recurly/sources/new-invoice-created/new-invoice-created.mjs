import app from "../../recurly.app.mjs";

export default {
  key: "recurly-new-invoice-created",
  name: "New Invoice Created",
  description: "Emit new event when a new invoice is created. [See the docs](https://recurly.com/developers/api/v2021-02-25/index.html#operation/list_invoices).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    app,
  },
  async run() {},
};
