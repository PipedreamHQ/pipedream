import reputationLyncs from "../../reputation_lyncs.app.mjs";

export default {
  key: "reputation_lyncs-add-customer",
  name: "Add Customer",
  description:
    "Adds a new customer to the Reputation Lyncs platform. Requires the customer's full name. Optionally, an email and a phone number can be provided.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    reputationLyncs,
    customerName: {
      propDefinition: [
        reputationLyncs,
        "customerName",
      ],
    },
    email: {
      propDefinition: [
        reputationLyncs,
        "email",
      ],
    },
    phoneNumber: {
      propDefinition: [
        reputationLyncs,
        "phoneNumber",
      ],
    },
    whatsappEnabled: {
      propDefinition: [
        reputationLyncs,
        "whatsappEnabled",
      ],
    },
    tags: {
      propDefinition: [
        reputationLyncs,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const whatsappEnabled =
      this.whatsappEnabled === undefined
        ? undefined
        : Number(this.whatsappEnabled);
    const response = await this.reputationLyncs.addCustomer({
      $,
      data: {
        fullName: this.customerName,
        email: this.email,
        phone: this.phoneNumber,
        whatsappEnabled,
        tags: this.tags,
      },
    });

    $.export("$summary", "Successfully added new customer");
    return response;
  },
};
