const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-refund",
  name: "Retrieve a Refund",
  type: "action",
  version: "0.0.2",
  description: "Retrieves the details of an existing refund. [See the " +
    "docs](https://stripe.com/docs/api/refunds/retrieve) for more information",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "refund",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.stripe.sdk().refunds.retrieve(this.id);
    $.export("$summary", `Successfully retrieved the refund, "${resp.id}"`);
    return resp;
  },
};
