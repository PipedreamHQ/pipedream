import app from "../../stripe.app.mjs";

export default {
  key: "stripe-update-refund",
  name: "Update a Refund",
  type: "action",
  version: "0.1.3",
  description: "Update the metadata on a refund. [See the documentation](https://stripe.com/docs/api/refunds/update).",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "refund",
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

    const resp = await app.sdk().refunds.update(id, {
      metadata,
    });
    $.export("$summary", `Successfully updated the refund, \`${resp.id}\`.`);
    return resp;
  },
};
