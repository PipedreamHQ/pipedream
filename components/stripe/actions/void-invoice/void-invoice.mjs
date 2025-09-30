import app from "../../stripe.app.mjs";

export default {
  key: "stripe-void-invoice",
  name: "Void Invoice",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Void an invoice. [See the documentation](https://stripe.com/docs/api/invoices/void).",
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
    const {
      app,
      id,
    } = this;

    const resp = await app.sdk().invoices.voidInvoice(id);
    $.export("$summary", `Successfully voided the invoice, \`${resp.number || resp.id}\`.`);
    return resp;
  },
};
