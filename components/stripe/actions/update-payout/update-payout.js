const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-update-payout",
  name: "Update a Payout",
  type: "action",
  version: "0.0.2",
  description: "Update the metadata on a payout. [See the " +
    "docs](https://stripe.com/docs/api/payouts/update) for more information",
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
  async run({ $ }) {
    const resp = await this.stripe.sdk().payouts.update(this.id, {
      metadata: this.metadata,
    });
    $.export("$summary", `Successfully updated the payout, "${resp.description || resp.id}"`);
    return resp;
  },
};
