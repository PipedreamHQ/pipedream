import proabono from "../../proabono.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "proabono-create-subscription",
  name: "Create Subscription",
  description: "Initializes a new subscription for a customer in the ProAbono system.",
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
    subscriptionDetails: {
      propDefinition: [
        proabono,
        "subscriptionDetails",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    // Check if customer exists
    const customer = await this.proabono.getCustomer({
      customerId: this.customerId,
    });
    if (!customer) {
      throw new Error(`Customer with ID ${this.customerId} not found.`);
    }

    // Initialize subscription
    const response = await this.proabono.initializeSubscription({
      customerId: this.customerId,
      subscriptionDetails: this.subscriptionDetails,
    });

    // Export summary
    $.export("$summary", `Created subscription for customer ID ${this.customerId}`);

    // Return response
    return response;
  },
};
