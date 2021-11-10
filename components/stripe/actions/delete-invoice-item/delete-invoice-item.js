const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-delete-invoice-item",
  name: "Delete Invoice Line Item",
  type: "action",
  version: "0.0.1",
  description: "Delete a line item from an invoice",
  props: {
    stripe,
    // Used to populate invoice_item options
    invoice: {
      propDefinition: [
        stripe,
        "invoice",
      ],
    },
    id: {
      propDefinition: [
        stripe,
        "invoice_item",
      ],
      optional: false,
    },
  },
  async run() {
    return await this.stripe.sdk().invoiceItems.del(this.id);
  },
};
