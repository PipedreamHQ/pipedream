const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-update-refund",
  name: "Update a Refund",
  type: "action",
  version: "0.0.1",
  description: "Update the metadata on a refund.",
  props: {
    stripe,
    id: {
      "propDefinition": [
        stripe,
        "refund",
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
    return await this.stripe.sdk().refunds.update(this.id, {
      metadata: this.metadata,
    });
  },
};
