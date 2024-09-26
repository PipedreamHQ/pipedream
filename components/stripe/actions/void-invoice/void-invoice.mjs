import app from "../../stripe.app.mjs";

export default {
  key: "stripe-void-invoice",
  name: "Void Invoice",
  type: "action",
  version: "0.1.0",
  description: "Void an invoice. [See the docs](https://stripe.com/docs/api/invoices/void) for " +
    "more information",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "invoice",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.app.sdk().invoices.voidInvoice(this.id);
    $.export("$summary", `Successfully voided the invoice, "${resp.number || resp.id}"`);
    return resp;
  },
};
