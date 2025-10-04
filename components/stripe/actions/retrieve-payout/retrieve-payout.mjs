import app from "../../stripe.app.mjs";

export default {
  key: "stripe-retrieve-payout",
  name: "Retrieve a Payout",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves the details of an existing payout. [See the documentation](https://stripe.com/docs/api/payouts/retrieve).",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "payout",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.app.sdk().payouts.retrieve(this.id);
    $.export("$summary", `Successfully retrieved the payout, \`${resp.description || resp.id}\`.`);
    return resp;
  },
};
