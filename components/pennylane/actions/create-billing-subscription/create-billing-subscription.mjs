import pennylane from "../../pennylane.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pennylane-create-billing-subscription",
  name: "Create Billing Subscription",
  description: "Creates a billing subscription for a customer. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    pennylane: {
      type: "app",
      app: "pennylane",
    },
    customerId: {
      propDefinition: [
        pennylane,
        "customerId",
      ],
    },
    subscriptionPlanId: {
      propDefinition: [
        pennylane,
        "subscriptionPlanId",
      ],
    },
    billingFrequency: {
      propDefinition: [
        pennylane,
        "billingFrequency",
      ],
    },
    subscriptionDiscounts: {
      propDefinition: [
        pennylane,
        "subscriptionDiscounts",
      ],
      optional: true,
    },
    subscriptionCustomNotes: {
      propDefinition: [
        pennylane,
        "subscriptionCustomNotes",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pennylane.createBillingSubscription();
    $.export("$summary", `Created billing subscription with ID ${response.billing_subscription.id}`);
    return response;
  },
};
