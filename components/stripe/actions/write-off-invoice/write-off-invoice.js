const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-write-off-invoice",
  name: "Write Off Invoice",
  type: "action",
  version: "0.0.2",
  description: "Mark an invoice as uncollectible. [See the " +
    "docs](https://stripe.com/docs/api/invoices/mark_uncollectible) for more information",
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
    return await this.stripe.sdk().invoices.markUncollectible(this.id);
  },
};
