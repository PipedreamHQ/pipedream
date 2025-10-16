import app from "../../stripe.app.mjs";

export default {
  key: "stripe-update-payout",
  name: "Update a Payout",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update the metadata on a payout. [See the documentation](https://stripe.com/docs/api/payouts/update).",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "payout",
      ],
      optional: false,
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const {
      app,
      id,
      metadata,
    } = this;

    const resp = await app.sdk().payouts.update(id, {
      metadata,
    });
    $.export("$summary", `Successfully updated the payout, \`${resp.description || resp.id}\`.`);
    return resp;
  },
};
