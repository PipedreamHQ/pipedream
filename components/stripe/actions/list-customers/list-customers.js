const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-list-customers",
  name: "List Customers",
  version: "0.0.1",
  description: "Find or list customers",
  props: {
    stripe,
    email: {
      propDefinition: [
        stripe,
        "email",
        {
          description: "Search by customer email address (case-sensitive)",
        },
      ],
    },
  },
  async run() {
    return await this.stripe.paginate(
      (params) => this.stripe.sdk().customers.list({
        ...pick(this, [
          "email",
        ]),
        ...params,
      }),
    );
  },
};
