const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-price",
  name: "Retrieve a Price",
  type: "action",
  version: "0.0.2",
  description: "Retrieves the details of an existing product price. [See the " +
    "docs](https://stripe.com/docs/api/prices/retrieve) for more information",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "price",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.stripe.sdk().prices.retrieve(this.id);
    $.export("$summary", `Successfully retrieved the price, "${resp.nickname || resp.id}"`);
    return resp;
  },
};
