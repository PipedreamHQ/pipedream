import booqable from "../../booqable.app.mjs";

export default {
  key: "booqable-update-customer",
  name: "Update Customer",
  description: "Updates the details of an existing customer in Booqable.",
  version: "0.0.1",
  type: "action",
  props: {
    booqable,
    customer: {
      propDefinition: [
        booqable,
        "customer",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "New name of the customer.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "New email of the customer.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.booqable.updateCustomer({
      $,
      customerId: this.customer,
      name: this.name,
      email: this.email,
    });

    $.export("$summary", `Successfully updated customer with ID: ${response.customer.id}`);

    return response;
  },
};
