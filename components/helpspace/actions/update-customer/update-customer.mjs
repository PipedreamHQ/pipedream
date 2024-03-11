import helpspace from "../../helpspace.app.mjs";

export default {
  key: "helpspace-update-customer",
  name: "Update Customer",
  description: "Updates a customer's details in Helpspace",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    helpspace,
    customerId: {
      propDefinition: [
        helpspace,
        "customerId",
      ],
    },
    customerName: {
      propDefinition: [
        helpspace,
        "customerName",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        helpspace,
        "email",
      ],
      optional: true,
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
    const data = {
      name: this.customerName,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
    const response = await this.helpspace.updateCustomer({
      customerId: this.customerId,
      data,
    });
    $.export("$summary", `Updated customer ${this.customerId}`);
    return response;
  },
};
