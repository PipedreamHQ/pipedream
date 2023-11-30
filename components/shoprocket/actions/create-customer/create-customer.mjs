import shoprocket from "../../shoprocket.app.mjs";

export default {
  key: "shoprocket-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Shoprocket. [See the documentation](https://docs.shoprocket.io/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    shoprocket,
    customerEmail: shoprocket.propDefinitions.customerEmail,
  },
  async run({ $ }) {
    const customerData = {
      email: this.customerEmail,
    };

    const response = await this.shoprocket.createCustomer(customerData);

    $.export("$summary", `Successfully created customer with email ${this.customerEmail}`);
    return response;
  },
};
