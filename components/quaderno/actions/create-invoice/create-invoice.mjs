import app from "../../quaderno.app.mjs";

export default {
  key: "quaderno-create-invoice",
  name: "Create Invoice",
  description: "Generate a new invoice in Quaderno. [See the Documentation](https://developers.quaderno.io/api/#tag/Invoices/operation/createInvoice).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
