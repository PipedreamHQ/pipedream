import app from "../../customer_io.app.mjs";

export default {
  key: "customer_io-create-or-update-customer",
  name: "Create or Update Customer",
  description: "Creates or update a customer. [See the docs here](https://customer.io/docs/api/#apitrackcustomerscustomers_update)",
  version: "0.2.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    email: {
      label: "Email",
      type: "string",
      description: "The unique identifier for the customer.",
    },
    created_at: {
      type: "string",
      label: "Created At",
      description: "The UNIX timestamp from when the user was created in your system.",
      optional: true,
    },
    attributes: {
      type: "object",
      label: "Attributes",
      description: "Custom attributes to define the customer.",
      optional: true,
    },
  },
  async run({ $ }) {
    await this.app.createOrUpdateCustomer(this.customerId, {
      email: this.email,
      created_at: this.created_at,
      ...this.attributes,
    }, $);
    $.export("$summary", "Successfully created/updated customer");
  },
};
