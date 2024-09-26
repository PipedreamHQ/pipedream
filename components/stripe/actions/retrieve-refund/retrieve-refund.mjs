import app from "../../stripe.app.mjs";

export default {
  key: "stripe-retrieve-refund",
  name: "Retrieve a Refund",
  type: "action",
  version: "0.1.0",
  description: "Retrieves the details of an existing refund. [See the " +
    "docs](https://stripe.com/docs/api/refunds/retrieve) for more information",
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
    $.export("$summary", `Successfully retrieved the refund, "${resp.id}"`);
    return resp;
  },
};
