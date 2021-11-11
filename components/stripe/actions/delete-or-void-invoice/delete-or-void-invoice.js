const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-delete-or-void-invoice",
  name: "Delete Or Void Invoice",
  type: "action",
  version: "0.0.2",
  description: "Delete a draft invoice, or void a non-draft or subscription invoice. [See the " +
    "docs](https://stripe.com/docs/api/invoiceitems/delete) for more information",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "invoice",
      ],
      optional: false,
    },
  },
  async run() {
    const {
      status,
      subscription,
    } = await this.stripe.sdk().invoices.retrieve(this.id);
    if (status === "draft" && !subscription) {
      return await this.stripe.sdk().invoices.del(this.id);
    }
    return await this.stripe.sdk().invoices.voidInvoice(this.id);
  },
};
