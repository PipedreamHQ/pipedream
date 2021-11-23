const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-customer",
  name: "Retrieve a Customer",
  type: "action",
  version: "0.0.2",
  description: "Retrieves the details of an existing customer. [See the " +
    "docs](https://stripe.com/docs/api/customers/retrieve) for more information",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "customer",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.stripe.sdk().customers.retrieve(this.id);
    $.export("$summary", `Successfully retrieved the customer, "${resp.id}"`);
    return resp;
  },
};
