import recharge from "../../recharge.app.mjs";

export default {
  key: "recharge-create-subscription",
  name: "Create Subscription",
  description: "Creates a new subscription allowing a customer to subscribe to a product. [See the documentation](https://developer.rechargepayments.com/2021-11/subscriptions/subscriptions_create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    recharge,
    addressId: {
      propDefinition: [
        recharge,
        "addressId",
      ],
    },
    chargeIntervalFrequency: {
      type: "integer",
      label: "Charge Interval Frequency",
      description: "The number of units, specified in `Order Interval Unit`, between each charge.",
    },
    nextChargeScheduledAt: {
      type: "string",
      label: "Next Charge Scheduled At",
      description: "This will set the first charge date of a new subscription. Can be a date string such as `2021-12-17`.",
    },
    orderIntervalFrequency: {
      type: "integer",
      label: "Order Interval Frequency",
      description: "The number of units, specified in `Order Interval Unit`, between each order.",
    },
    orderIntervalUnit: {
      type: "string",
      label: "Order Interval Unit",
      description: "The frequency unit used to determine when a subscription order is created.",
      options: [
        "day",
        "week",
        "month",
      ],
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "The quantity of the product.",
    },
    externalVariantId: {
      propDefinition: [
        recharge,
        "externalVariantId",
      ],
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional parameters to be passed in the request. [See the documentation](https://developer.rechargepayments.com/2021-11/subscriptions/subscriptions_create) for all available parameters.",
    },
  },
  async run({ $ }) {
    const response = await this.recharge.createSubscription({
      $,
      data: {
        address_id: this.addressId,
        charge_interval_frequency: this.chargeIntervalFrequency,
        next_charge_scheduled_at: this.nextChargeScheduledAt,
        order_interval_frequency: this.orderIntervalFrequency,
        order_interval_unit: this.orderIntervalUnit,
        quantity: this.quantity,
        external_variant_id: this.externalVariantId && {
          ecommerce: this.externalVariantId,
        },
        ...Object.fromEntries(Object.entries(this.additionalOptions).map(([
          key,
          value,
        ]) => {
          try {
            value = JSON.parse(value);
          } catch (e) {
            e; // JSON parsing is optional
          }

          return [
            key,
            value,
          ];
        })),
      },
    });

    $.export("$summary", `Successfully created a new subscription with ID ${response?.subscription?.id}`);
    return response;
  },
};
