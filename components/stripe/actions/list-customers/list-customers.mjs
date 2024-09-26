import pick from "lodash.pick";
import app from "../../stripe.app.mjs";

export default {
  key: "stripe-list-customers",
  name: "List Customers",
  type: "action",
  version: "0.1.0",
  description: "Find or list customers. [See the " +
    "docs](https://stripe.com/docs/api/customers/list) for more information",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
      description: "Search by customer email address (case-sensitive)",
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = pick(this, [
      "email",
    ]);
    const resp = await this.app.sdk().customers.list(params)
      .autoPagingToArray({
        limit: this.limit,
      });

    $.export("$summary", "Successfully fetched customer info");

    return resp;
  },
};
