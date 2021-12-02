const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-update-refund",
  name: "Update a Refund",
  type: "action",
  version: "0.0.2",
  description: "Update the metadata on a refund. [See the " +
    "docs](https://stripe.com/docs/api/refunds/update) for more information",
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
  async run({ $ }) {
    const resp = await this.stripe.sdk().refunds.update(this.id, {
      metadata: this.metadata,
    });
    $.export("$summary", `Successfully updated the refund, "${resp.id}"`);
    return resp;
  },
};
