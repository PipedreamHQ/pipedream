import { ConfigurationError } from "@pipedream/platform";
import reputationLyncs from "../../reputation_lyncs.app.mjs";

export default {
  key: "reputation_lyncs-add-customer",
  name: "Add Customer",
  description:
    "Adds a new customer to the Reputation Lyncs platform. Requires the customer's full name. Optionally, an email and a phone number can be provided.",
  version: "0.0.1",
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

    if (!this.email && !this.phoneNumber) {
      throw new ConfigurationError("You must provide at least one of **Email** or **Phone Number**");
    }

    const response = await this.reputationLyncs.addCustomer({
      $,
      data: {
        customer_name: this.customerName,
        email_id: this.email,
        phone_number: this.phoneNumber,
        whatsapp_enabled: whatsappEnabled,
        tags: this.tags,
      },
    });

    $.export("$summary", "Successfully added new customer");
    return response;
  },
};
