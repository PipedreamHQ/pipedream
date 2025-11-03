import app from "../../stripe.app.mjs";

export default {
  key: "stripe-retrieve-customer",
  name: "Retrieve a Customer",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves the details of an existing customer. [See the documentation](https://stripe.com/docs/api/customers/retrieve).",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "customer",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.app.sdk().customers.retrieve(this.id);
    $.export("$summary", `Successfully retrieved the customer with ID \`${resp.id}\`.`);
    return resp;
  },
};
