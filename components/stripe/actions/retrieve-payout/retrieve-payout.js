const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-payout",
  name: "Retrieve a Payout",
  type: "action",
  version: "0.0.2",
  description: "Retrieves the details of an existing payout. [See the " +
    "docs](https://stripe.com/docs/api/payouts/retrieve) for more information",
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
  async run({ $ }) {
    const resp = await this.stripe.sdk().payouts.retrieve(this.id);
    $.export("$summary", `Successfully retrieved the payout, "${resp.description || resp.id}"`);
    return resp;
  },
};
