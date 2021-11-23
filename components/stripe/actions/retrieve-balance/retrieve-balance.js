const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-balance",
  name: "Retrieve the Current Balance",
  type: "action",
  version: "0.0.2",
  description: "Retrieves the current account balance, based on the authentication that was used " +
    "to make the request. [See the docs](https://stripe.com/docs/api/balance/balance_retrieve) " +
    "for more information",
  props: {
    stripe,
  },
  async run({ $ }) {
    const resp = await this.stripe.sdk().balance.retrieve();
    $.export("$summary", "Successfully retrieved the current balance");
    return resp;
  },
};
