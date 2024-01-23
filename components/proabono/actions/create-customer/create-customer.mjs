import proabono from "../../proabono.app.mjs";

export default {
  key: "proabono-create-customer",
  name: "Create or Update a Customer",
  description: "Creates a new customer or updates an existing one in the ProAbono system.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    proabono,
    customerId: {
      propDefinition: [
        proabono,
        "customerId",
      ],
    },
    customerDetails: {
      propDefinition: [
        proabono,
        "customerDetails",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.proabono.createOrUpdateCustomer({
      customerId: this.customerId,
      customerDetails: this.customerDetails,
    });
    $.export("$summary", `Successfully ${this.customerDetails
      ? "updated"
      : "created"} customer with ID: ${this.customerId}`);
    return response;
  },
};
