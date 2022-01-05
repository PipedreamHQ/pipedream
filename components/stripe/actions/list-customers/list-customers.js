const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-list-customers",
  name: "List Customers",
  type: "action",
  version: "0.0.2",
  description: "Find or list customers. [See the " +
    "docs](https://stripe.com/docs/api/customers/list) for more information",
  props: {
    stripe,
    email: {
      propDefinition: [
        stripe,
        "email",
      ],
      description: "Search by customer email address (case-sensitive)",
    },
    limit: {
      propDefinition: [
        stripe,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = pick(this, [
      "email",
    ]);
    const resp = await this.stripe.sdk().customers.list(params)
      .autoPagingToArray({
        limit: this.limit,
      });

    $.export("$summary", "Successfully fetched customer info");

    return resp;
  },
};
