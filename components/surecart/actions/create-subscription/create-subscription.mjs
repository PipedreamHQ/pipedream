import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-create-subscription",
  name: "Create Subscription",
  description: "Create a new subscription for a customer. [See the documentation](https://developer.surecart.com/api-reference/subscriptions/create)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    customer: {
      propDefinition: [
        surecart,
        "customerId",
      ],
    },
    price: {
      type: "string",
      label: "Price ID",
      description: "UUID of the recurring price to subscribe to. Example: `price_abc123`",
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method ID",
      description: "UUID of the payment method to charge. Example: `pm_abc123`",
      optional: true,
    },
    manualPaymentMethod: {
      type: "string",
      label: "Manual Payment Method ID",
      description: "UUID of a manual payment method (e.g. bank transfer). Example: `mpm_abc123`",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "ISO 4217 currency code. Example: `usd`",
      optional: true,
    },
    discount: {
      type: "object",
      label: "Discount",
      description: "Coupon or promotion code to apply. Example: `{ \"coupon\": \"coup_abc123\" }` or `{ \"promotion_code\": \"SAVE10\" }`",
      optional: true,
    },
    variant: {
      type: "string",
      label: "Variant ID",
      description: "UUID of the product variant. Example: `var_abc123`",
      optional: true,
    },
    shippingMethod: {
      type: "string",
      label: "Shipping Method ID",
      description: "UUID of the shipping method. Example: `sm_abc123`",
      optional: true,
    },
    affiliation: {
      type: "string",
      label: "Affiliation ID",
      description: "UUID of the affiliate to associate with this subscription. Example: `aff_abc123`",
      optional: true,
    },
    imported: {
      type: "boolean",
      label: "Imported",
      description: "Set to `true` when migrating a subscription from another platform.",
      optional: true,
    },
    firstScPeriodStartAt: {
      type: "integer",
      label: "First Period Start At (Unix timestamp)",
      description: "Unix timestamp for when the next billing period starts (use with `imported`). Example: `1700000000`",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional key-value metadata. Example: `{ \"source\": \"migration\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.createSubscription({
      $,
      data: {
        subscription: {
          customer: this.customer,
          price: this.price,
          payment_method: this.paymentMethod,
          manual_payment_method: this.manualPaymentMethod,
          currency: this.currency,
          discount: this.discount,
          variant: this.variant,
          shipping_method: this.shippingMethod,
          affiliation: this.affiliation,
          imported: this.imported,
          first_sc_period_start_at: this.firstScPeriodStartAt,
          metadata: this.metadata,
        },
      },
    });
    $.export("$summary", `Successfully created subscription ${response.id}`);
    return response;
  },
};
