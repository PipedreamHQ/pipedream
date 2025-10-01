import { ConfigurationError } from "@pipedream/platform";
import reputationLyncs from "../../reputation_lyncs.app.mjs";

export default {
  key: "reputation_lyncs-add-customer",
  name: "Add Customer",
  description:
    "Adds a new customer to the Reputation Lyncs platform. [See the documentation](https://documenter.getpostman.com/view/25361963/2s93Xzw2bS#46718236-5ef1-4c93-992d-cd7d3722b02f)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        tags: this.tags?.join?.() ?? this.tags,
      },
    });

    if (response.status === "error") {
      $.export("response", response);
      throw new Error(`API Response: "${response.result?.join?.(", ")}"`);
    }

    $.export("$summary", `Successfully added new customer (ID: ${response?.customerId})`);
    return response;
  },
};
