import app from "../../stripe.app.mjs";

export default {
  key: "stripe-create-product",
  name: "Create Product",
  description: "Creates a new product object in Stripe. [See the documentation](https://stripe.com/docs/api/products/create).",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      description: "The product's name, meant to be displayable to the customer.",
      optional: false,
      propDefinition: [
        app,
        "name",
      ],
    },
    active: {
      description: "Whether the product is currently available for purchase. Defaults to true.",
      propDefinition: [
        app,
        "active",
      ],
    },
    unitLabel: {
      type: "string",
      label: "Unit Label",
      description: "A label that represents units of this product. When set, this will be included in customers receipts, invoices, Checkout, and the customer portal.",
      optional: true,
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    defaultPriceDataUnitAmount: {
      label: "Default Price Data - Unit Amount",
      description: "A positive integer in cents (or `0` for a free price) representing how much to charge. One of **Unit Amount** or **Unit Amount Decimal** is required.",
      propDefinition: [
        app,
        "unitAmount",
      ],
    },
    defaultPriceDataUnitAmountDecimal: {
      label: "Default Price Data - Unit Amount Decimal",
      propDefinition: [
        app,
        "unitAmountDecimal",
      ],
    },
    defaultPriceDataCurrency: {
      label: "Default Price Data - Currency",
      propDefinition: [
        app,
        "currency",
        ({ country }) => ({
          country,
        }),
      ],
    },
    defaultPriceDataRecurringInterval: {
      label: "Default Price Data - Recurring - Interval",
      optional: true,
      propDefinition: [
        app,
        "recurringInterval",
      ],
    },
  },
  methods: {
    createProduct(args = {}) {
      return this.app.sdk().products.create(args);
    },
  },
  async run({ $ }) {
    const {
      createProduct,
      name,
      defaultPriceDataUnitAmount,
      defaultPriceDataUnitAmountDecimal,
      active,
      unitLabel,
      defaultPriceDataCurrency,
      defaultPriceDataRecurringInterval,
    } = this;

    const response = await createProduct({
      name,
      active,
      unit_label: unitLabel,
      ...(
        defaultPriceDataCurrency
        || defaultPriceDataUnitAmount
        || defaultPriceDataUnitAmountDecimal
        || defaultPriceDataRecurringInterval
          ? {
            default_price_data: {
              currency: defaultPriceDataCurrency,
              recurring: {
                interval: defaultPriceDataRecurringInterval,
              },
              unit_amount: defaultPriceDataUnitAmount,
              unit_amount_decimal: defaultPriceDataUnitAmountDecimal,
            },
          }
          : {}
      ),
    });

    $.export("$summary", `Successfully created a new product with ID \`${response.id}\`.`);

    return response;
  },
};
