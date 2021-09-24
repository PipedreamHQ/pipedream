const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-price",
  name: "Retrieve a Price",
  type: "action",
  version: "0.0.1",
  description: "Retrieves the details of an existing product price.",
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
  async run() {
    return await this.stripe.sdk().prices.retrieve(this.id);
  },
};
