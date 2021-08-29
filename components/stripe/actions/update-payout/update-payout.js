const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-update-payout",
  name: "Update a Payout",
  type: "action",
  version: "0.0.1",
  description: "Update the metadata on a payout.",
  props: {
    stripe,
    id: {
      "propDefinition": [
        stripe,
        "payout",
      ],
      "optional": false,
    },
    metadata: {
      "propDefinition": [
        stripe,
        "metadata",
      ],
      "optional": false,
    },
  },
  async run() {
    return await this.stripe.sdk().payouts.update(this.id, {
      metadata: this.metadata,
    });
  },
};
