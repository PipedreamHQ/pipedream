import booqable from "../../booqable.app.mjs";

export default {
  key: "booqable-update-customer",
  name: "Update Customer",
  description: "Updates the details of an existing customer in Booqable.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    booqable,
    customerId: {
      propDefinition: [
        booqable,
        "customerId",
      ],
    },
    name: {
      propDefinition: [
        booqable,
        "name",
        (c) => ({
          customer_id: c.customerId,
        }),
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        booqable,
        "email",
        (c) => ({
          customer_id: c.customerId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.booqable.updateCustomerDetails({
      customerId: this.customerId,
      name: this.name,
      email: this.email,
    });
    $.export("$summary", `Successfully updated customer ${this.customerId}`);
    return response;
  },
};
