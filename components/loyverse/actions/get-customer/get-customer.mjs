import loyverse from "../../loyverse.app.mjs";

export default {
  key: "loyverse-get-customer",
  name: "Get Customer",
  description: "Retrieves details of a specific customer using their customer ID. [See the documentation](https://developer.loyverse.com/docs/)",
  version: "0.0.1",
  type: "action",
  props: {
    loyverse,
    customerId: {
      propDefinition: [
        loyverse,
        "customerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.loyverse.getCustomerDetails({
      customerId: this.customerId,
    });
    $.export("$summary", `Successfully retrieved details for customer ID ${this.customerId}`);
    return response;
  },
};
