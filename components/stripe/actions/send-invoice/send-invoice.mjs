import app from "../../stripe.app.mjs";

export default {
  key: "stripe-send-invoice",
  name: "Send Invoice",
  type: "action",
  version: "0.1.3",
  description: "Manually send an invoice to your customer out of the normal schedule for payment (note that no emails are actually sent in test mode). [See the documentation](https://stripe.com/docs/api/invoices/send).",
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
    const resp = await this.app.sdk().invoices.sendInvoice(this.id);
    $.export("$summary", `Successfully sent the invoice, \`${resp.number || resp.id}\`.`);
    return resp;
  },
};
