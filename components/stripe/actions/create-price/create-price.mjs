import app from "../../stripe.app.mjs";

export default {
  key: "stripe-create-price",
  name: "Create Price",
  description: "Creates a new price for an existing product. The price can be recurring or one-time. [See the documentation](https://stripe.com/docs/api/prices/create)",
  version: "0.0.4",
  type: "action",
  props: {
    app,
    product: {
      propDefinition: [
        app,
        "productId",
      ],
    },
    country: {
      optional: false,
      propDefinition: [
        app,
        "country",
      ],
    },
    currency: {
      optional: false,
      propDefinition: [
        app,
        "currency",
        ({ country }) => ({
          country,
        }),
      ],
    },
    active: {
      description: "Whether the price can be used for new purchases. Defaults to `true`",
      propDefinition: [
        app,
        "active",
      ],
    },
    unitAmount: {
      description: "A positive integer in cents (or `0` for a free price) representing how much to charge. One of **Unit Amount** or **Custom Unit Amount** is required, unless **Billing Scheme** is `tiered`.",
      propDefinition: [
        app,
        "unitAmount",
      ],
    },
    customUnitAmountEnabled: {
      type: "boolean",
      label: "Custom Unit Amount Enabled",
      description: "Pass in `true` to enable **Custom Unit Amount**",
      optional: true,
    },
    customUnitAmountMaximum: {
      type: "integer",
      label: "Custom Unit Amount Maximum",
      description: "The maximum unit amount the customer can specify for this item.",
      optional: true,
    },
    customUnitAmountMinimum: {
      type: "integer",
      label: "Custom Unit Amount Minimum",
      description: "The minimum unit amount the customer can specify for this item.",
      optional: true,
    },
    customUnitAmountPreset: {
      type: "integer",
      label: "Custom Unit Amount Preset",
      description: "The starting unit amount which can be updated by the customer.",
      optional: true,
    },
    recurringInterval: {
      optional: true,
      propDefinition: [
        app,
        "recurringInterval",
      ],
    },
    recurringUsageType: {
      type: "string",
      label: "Recurring Usage Type",
      description: "Configures how the quantity per period should be determined. Can be either `metered` or `licensed`. `licensed` automatically bills the quantity set when adding it to a subscription. `metered` aggregates the total usage based on usage records. Defaults to `licensed`.",
      optional: true,
      options: [
        "licensed",
        "metered",
      ],
    },
  },
  methods: {
    createPrice(args = {}) {
      return this.app.sdk().prices.create(args);
    },
  },
  async run({ $ }) {
    const {
      createPrice,
      product,
      currency,
      active,
      unitAmount,
      customUnitAmountEnabled,
      customUnitAmountMaximum,
      customUnitAmountMinimum,
      customUnitAmountPreset,
      recurringInterval,
      recurringUsageType,
    } = this;

    const response = await createPrice({
      product,
      currency,
      active,
      unit_amount: unitAmount,
      ...(customUnitAmountEnabled && {
        custom_unit_amount: {
          enabled: true,
          maximum: customUnitAmountMaximum,
          minimum: customUnitAmountMinimum,
          preset: customUnitAmountPreset,
        },
      }),
      ...(recurringInterval && {
        recurring: {
          interval: recurringInterval,
          usage_type: recurringUsageType,
        },
      }),
    });

    $.export("$summary", `Successfully created a new price with ID \`${response.id}\`.`);
    return response;
  },
};
