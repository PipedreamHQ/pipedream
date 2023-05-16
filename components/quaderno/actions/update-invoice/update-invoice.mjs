import app from "../../quaderno.app.mjs";

export default {
  key: "quaderno-update-invoice",
  name: "Update Invoice",
  description: "Modify an existing invoice&#39;s details in Quaderno. [See the Documentation](https://developers.quaderno.io/api/#tag/Invoices/operation/updateInvoice).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
