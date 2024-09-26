import app from "../../stripe.app.mjs";

export default {
  key: "stripe-cancel-or-reverse-payout",
  name: "Cancel Or Reverse a Payout",
  type: "action",
  version: "0.1.0",
  description: "Cancel or reverse a [payout](https://stripe.com/docs/payouts). " +
    "A payout can be canceled only if it has not yet been paid out. A payout can be reversed " +
    "only if it has already been paid out. Funds will be refunded to your available balance. [See" +
    " the docs](https://stripe.com/docs/api/payouts/cancel) for more information",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "payout",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const payout = await this.app.sdk().payouts.retrieve(this.id);
    let resp;
    switch (payout.status) {
    case "paid":
      resp = await this.app.sdk().payouts.reverse(this.id);
      $.export("$summary", "Successfully reversed paid payout");
      return resp;
    case "pending":
      resp = await this.app.sdk().payouts.cancel(this.id);
      $.export("$summary", "Successfully cancelled pending payout");
      return resp;
    case "in_transit":
      throw new Error("Payment is in transit");
    case "canceled":
      throw new Error("Payment has already been canceled");
    case "failed":
      throw new Error("Payment has already failed");
    }
  },
};
