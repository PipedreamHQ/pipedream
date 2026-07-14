import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-update-subscription",
  name: "Update Subscription",
  description: "Update an existing subscription. [See the documentation](https://developer.surecart.com/api-reference/subscriptions/update)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    subscriptionId: {
      propDefinition: [
        surecart,
        "subscriptionId",
      ],
    },
    refreshPriceVersion: {
      type: "boolean",
      label: "Refresh Price Version",
      description: "Update the subscription to use the most recent version of its price.",
      optional: true,
    },
    skipProductGroupValidation: {
      type: "boolean",
      label: "Skip Product Group Validation",
      description: "Allow price updates regardless of product group restrictions.",
      optional: true,
    },
    skipProration: {
      type: "boolean",
      label: "Skip Proration",
      description: "Prevent proration charges on the next billing period.",
      optional: true,
    },
    updateBehavior: {
      type: "string",
      label: "Update Behavior",
      description: "When to apply the update. Defaults to the account subscription protocol setting.",
      optional: true,
      options: [
        "immediate",
        "pending",
      ],
    },
    price: {
      type: "string",
      label: "Price ID",
      description: "UUID of the new price to switch to. Example: `price_abc123`",
      optional: true,
    },
    customer: {
      propDefinition: [
        surecart,
        "customerId",
      ],
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method ID",
      description: "UUID of the new payment method. Example: `pm_abc123`",
      optional: true,
    },
    cancelAtPeriodEnd: {
      type: "boolean",
      label: "Cancel at Period End",
      description: "Set to `true` to cancel the subscription at the end of the current billing period.",
      optional: true,
    },
    trialEndAt: {
      type: "integer",
      label: "Trial End At (Unix timestamp)",
      description: "Unix timestamp to end the trial early or extend it. Example: `1710000000`",
      optional: true,
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "New subscription quantity. Example: `3`",
      optional: true,
    },
    adHocAmount: {
      type: "integer",
      label: "Ad Hoc Amount",
      description: "Custom billing amount in cents for ad hoc prices. Example: `9900`",
      optional: true,
    },
    discount: {
      type: "object",
      label: "Discount",
      description: "New coupon or promotion code. Example: `{ \"coupon\": \"coup_abc123\" }`",
      optional: true,
    },
    variant: {
      type: "string",
      label: "Variant ID",
      description: "UUID of the new product variant. Example: `var_abc123`",
      optional: true,
    },
    shippingMethod: {
      type: "string",
      label: "Shipping Method ID",
      description: "UUID of the shipping method. Example: `sm_abc123`",
      optional: true,
    },
    taxEnabled: {
      type: "boolean",
      label: "Tax Enabled",
      description: "Enable or disable tax collection for this subscription.",
      optional: true,
    },
    restoreAt: {
      type: "integer",
      label: "Restore At (Unix timestamp)",
      description: "Unix timestamp for automatic subscription restoration after cancellation. Example: `1720000000`",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Updated key-value metadata. Example: `{ \"plan\": \"enterprise\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.updateSubscription({
      $,
      subscriptionId: this.subscriptionId,
      params: {
        refresh_price_version: this.refreshPriceVersion,
        skip_product_group_validation: this.skipProductGroupValidation,
        skip_proration: this.skipProration,
        update_behavior: this.updateBehavior,
      },
      data: {
        subscription: {
          price: this.price,
          customer: this.customer,
          payment_method: this.paymentMethod,
          cancel_at_period_end: this.cancelAtPeriodEnd,
          trial_end_at: this.trialEndAt,
          quantity: this.quantity,
          ad_hoc_amount: this.adHocAmount,
          discount: this.discount,
          variant: this.variant,
          shipping_method: this.shippingMethod,
          tax_enabled: this.taxEnabled,
          restore_at: this.restoreAt,
          metadata: this.metadata,
        },
      },
    });
    $.export("$summary", `Successfully updated subscription ${this.subscriptionId}`);
    return response;
  },
};
