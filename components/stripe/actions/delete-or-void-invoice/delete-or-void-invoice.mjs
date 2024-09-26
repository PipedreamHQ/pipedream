import app from "../../stripe.app.mjs";

export default {
  key: "stripe-delete-or-void-invoice",
  name: "Delete Or Void Invoice",
  type: "action",
  version: "0.1.0",
  description: "Delete a draft invoice, or void a non-draft or subscription invoice. [See the " +
    "docs](https://stripe.com/docs/api/invoiceitems/delete) for more information",
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
      status,
      subscription,
    } = await this.app.sdk().invoices.retrieve(this.id);
    if (status === "draft" && !subscription) {
      const resp = await this.app.sdk().invoices.del(this.id);
      $.export("$summary", `Successfully deleted the draft invoice, "${resp.id}"`);
      return resp;
    }
    const resp = await this.app.sdk().invoices.voidInvoice(this.id);
    $.export("$summary", `Successfully voided the invoice, "${resp.id}"`);
    return resp;
  },
};
