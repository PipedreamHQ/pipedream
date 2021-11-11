const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-balance",
  name: "Retrieve the Current Balance",
  type: "action",
  version: "0.0.2",
  description: "Retrieves the details of an existing refund. [See the " +
    "docs](https://stripe.com/docs/api/balance/balance_retrieve) for more information",
  props: {
    stripe,
  },
  async run() {
    return await this.stripe.sdk().balance.retrieve();
  },
};
