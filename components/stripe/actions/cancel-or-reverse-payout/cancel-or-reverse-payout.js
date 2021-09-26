const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-cancel-or-reverse-payout",
  name: "Cancel Or Reverse a Payout",
  type: "action",
  version: "0.0.1",
  description: "Cancel or reverse a [payout](https://stripe.com/docs/payouts). " +
    "A payout can be canceled only if it has not yet been paid out. A payout can be reversed " +
    "only if it has already been paid out. Funds will be refunded to your available balance.",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "payout",
      ],
      optional: false,
    },
  },
  async run() {
    const payout = await this.stripe.sdk().payouts.retrieve(this.id);
    switch (payout.status) {
    case "paid":
      return await this.stripe.sdk().payouts.reverse(this.id);
    case "pending":
      return await this.stripe.sdk().payouts.cancel(this.id);
    case "in_transit":
      throw new Error("Payment is in transit");
    case "canceled":
      throw new Error("Payment has already been canceled");
    case "failed":
      throw new Error("Payment has already failed");
    }
  },
};
