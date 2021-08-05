const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-update-payout",
  name: "Update a Payout",
  version: "0.0.1",
  description: "Update the metadata on a payout.",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "payout",
        {
          "required": true,
        },
      ],
    },
    metadata: {
      propDefinition: [
        stripe,
        "metadata",
        {
          "required": true,
        },
      ],
    },
  },
  async run() {
    return await this.stripe.sdk().payouts.update(this.id, {
      metadata: this.metadata,
    });
  },
};
