import app from "../../stripe.app.mjs";

export default {
  key: "stripe-update-refund",
  name: "Update a Refund",
  type: "action",
  version: "0.1.0",
  description: "Update the metadata on a refund. [See the " +
    "docs](https://stripe.com/docs/api/refunds/update) for more information",
  props: {
    app,
    id: {
      "propDefinition": [
        app,
        "refund",
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
    const resp = await this.app.sdk().refunds.update(this.id, {
      metadata: this.metadata,
    });
    $.export("$summary", `Successfully updated the refund, "${resp.id}"`);
    return resp;
  },
};
