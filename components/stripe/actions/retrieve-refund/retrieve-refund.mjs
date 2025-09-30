import app from "../../stripe.app.mjs";

export default {
  key: "stripe-retrieve-refund",
  name: "Retrieve a Refund",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves the details of an existing refund. [See the documentation](https://stripe.com/docs/api/refunds/retrieve).",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "refund",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.app.sdk().refunds.retrieve(this.id);
    $.export("$summary", `Successfully retrieved the refund with ID \`${resp.id}\`.`);
    return resp;
  },
};
