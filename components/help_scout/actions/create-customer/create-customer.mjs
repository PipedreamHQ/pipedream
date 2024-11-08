import helpScout from "../../help_scout.app.mjs";

export default {
  key: "help_scout-create-customer",
  name: "Create Customer",
  description: "Creates a new customer record in Help Scout. [See the documentation](https://developer.helpscout.com/mailbox-api/endpoints/customers/create/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    helpScout,
    customerEmail: {
      propDefinition: [
        helpScout,
        "customerEmail",
      ],
    },
    customerPhone: {
      propDefinition: [
        helpScout,
        "customerPhone",
      ],
    },
    chatHandles: {
      propDefinition: [
        helpScout,
        "chatHandles",
      ],
    },
    socialProfiles: {
      propDefinition: [
        helpScout,
        "socialProfiles",
      ],
    },
    customerAddress: {
      propDefinition: [
        helpScout,
        "customerAddress",
      ],
    },
    customerDetails: {
      propDefinition: [
        helpScout,
        "customerDetails",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.helpScout.createCustomer({
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
      chatHandles: this.chatHandles,
      socialProfiles: this.socialProfiles,
      customerAddress: this.customerAddress,
      ...this.customerDetails,
    });

    $.export("$summary", `Successfully created customer with email: ${this.customerEmail}`);
    return response;
  },
};
