import app from "../../stripe.app.mjs";

export default {
  key: "stripe-update-payout",
  name: "Update a Payout",
  type: "action",
  version: "0.1.0",
  description: "Update the metadata on a payout. [See the " +
    "docs](https://stripe.com/docs/api/payouts/update) for more information",
  props: {
    app,
    id: {
      "propDefinition": [
        app,
        "payout",
      ],
      "optional": false,
    },
    metadata: {
      "propDefinition": [
        app,
        "metadata",
      ],
      "optional": false,
    },
  },
  async run({ $ }) {
    const resp = await this.app.sdk().payouts.update(this.id, {
      metadata: this.metadata,
    });
    $.export("$summary", `Successfully updated the payout, "${resp.description || resp.id}"`);
    return resp;
  },
};
