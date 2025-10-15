import app from "../../segmetrics.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Or Update Subscription",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "segmetrics-create-or-update-subscription",
  description: "Create or update a subscription. [See documentation here](https://developers.segmetrics.io/#subscriptions)",
  type: "action",
  props: {
    app,
    integrationId: {
      label: "Integration ID",
      description: "The ID of the integration from your Account Settings Page",
      type: "string",
    },
    subscriptionId: {
      label: "Subscription Id",
      description: "Unique identifier for the subscription",
      type: "string",
    },
    email: {
      label: "Contact's Email",
      description: "Email address of the contact",
      type: "string",
    },
    amount: {
      label: "Subscription Total in Cents",
      description: "Total amount of the subscription in cents",
      type: "integer",
    },
    productId: {
      label: "Product ID",
      description: "Product Id that the subscription applies to",
      type: "string",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "DateTime when the subscription started. E..g `2019-12-03 11:14:32`",
    },
    lastBillDate: {
      label: "Last Bill Date",
      description: "DateTime when the subscription was last billed. E.g. `2019-12-03 11:14:32`",
      type: "string",
    },
    billingCycle: {
      label: "Billing Cycle",
      description: "The frequency with which a subscription should be billed.",
      type: "string",
      options: constants.BILLING_CYCLES,
    },
    frequency: {
      label: "Billing Frequency",
      description: "The number of intervals (specified in the billing_cycle property) between subscription billings. For example, billing_cycle=month and frequency=3 bills every 3 months.",
      type: "integer",
    },
  },
  async run({ $ }) {
    const response = await this.app.createOrUpdateSubscription({
      $,
      integrationId: this.integrationId,
      data: {
        id: this.subscriptionId,
        email: this.email,
        amount: this.amount,
        product_id: this.productId,
        start_date: this.startDate,
        last_bill_date: this.lastBillDate,
        billing_cycle: this.billingCycle,
        frequency: this.frequency,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created or updated subscription with ID ${response.subscription.id}`);
    }

    return response;
  },
};
