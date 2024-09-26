import app from "../../stripe.app.mjs";

export default {
  key: "stripe-delete-customer",
  name: "Delete a Customer",
  type: "action",
  version: "0.1.0",
  description: "Delete a customer. [See the docs](https://stripe.com/docs/api/customers/delete) " +
    "for more information",
  props: {
    app,
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.app.sdk().customers.del(this.customer);
    $.export("$summary", `Successfully deleted the customer, "${resp.id}"`);
    return resp;
  },
};
