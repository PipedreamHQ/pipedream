import app from "../../stripe.app.mjs";

export default {
  key: "stripe-delete-customer",
  name: "Delete a Customer",
  type: "action",
  version: "0.1.3",
  description: "Delete a customer. [See the documentation](https://stripe.com/docs/api/customers/delete).",
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
    $.export("$summary", `Successfully deleted the customer with ID \`${resp.id}\`.`);
    return resp;
  },
};
