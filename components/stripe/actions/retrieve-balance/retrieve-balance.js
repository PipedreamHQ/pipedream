const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-balance",
  name: "Retrieve the Current Balance",
  type: "action",
  version: "0.0.1",
  description: "Retrieves the details of an existing refund.",
  props: {
    stripe,
  },
  async run() {
    return await this.stripe.sdk().balance.retrieve();
  },
};
