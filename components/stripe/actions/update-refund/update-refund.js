const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-update-refund",
  name: "Update a Refund",
  version: "0.0.1",
  description: "Update the metadata on a refund.",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "refund",
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
    return await this.stripe.sdk().refunds.update(this.id, {
      metadata: this.metadata,
    });
  },
};
