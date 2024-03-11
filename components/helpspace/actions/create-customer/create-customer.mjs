import helpspace from "../../helpspace.app.mjs";

export default {
  key: "helpspace-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Helpspace",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    helpspace,
    customerName: {
      propDefinition: [
        helpspace,
        "customerName",
      ],
    },
    email: {
      propDefinition: [
        helpspace,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        helpspace,
        "phone",
      ],
      optional: true,
    },
    address: {
      propDefinition: [
        helpspace,
        "address",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.helpspace.createCustomer({
      data: {
        name: this.customerName,
        email: this.email,
        phone: this.phone,
        address: this.address,
      },
    });
    $.export("$summary", `Successfully created customer with ID: ${response.id}`);
    return response;
  },
};
