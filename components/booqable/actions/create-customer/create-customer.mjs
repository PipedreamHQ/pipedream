import booqable from "../../booqable.app.mjs";

export default {
  key: "booqable-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Booqable. [See the documentation](https://developers.booqable.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    booqable,
    name: {
      propDefinition: [
        booqable,
        "name",
      ],
    },
    email: {
      propDefinition: [
        booqable,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.booqable.createCustomer({
      name: this.name,
      email: this.email,
    });
    $.export("$summary", `Successfully created customer ${this.name}`);
    return response;
  },
};
