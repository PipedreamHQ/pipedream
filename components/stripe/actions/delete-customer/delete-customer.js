const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-delete-customer",
  name: "Delete a Customer",
  type: "action",
  version: "0.0.2",
  description: "Delete a customer. [See the docs](https://stripe.com/docs/api/customers/delete) " +
    "for more information",
  props: {
    stripe,
    customer: {
      propDefinition: [
        stripe,
        "customer",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.stripe.sdk().customers.del(this.customer);
    $.export("$summary", `Successfully deleted the customer, "${resp.id}"`);
    return resp;
  },
};
