import app from "../../stripe.app.mjs";

export default {
  key: "stripe-create-product",
  name: "Create Product",
  description: "Creates a new product object in Stripe. [See the documentation](https://stripe.com/docs/api/products/create)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    name: {
      label: "Product Name",
      optional: false,
      propDefinition: [
        app,
        "name",
      ],
    },
    defaultPriceDataUnitAmount: {
      description: "A positive integer in cents (or `0` for a free price) representing how much to charge. One of **Unit Amount** or **Unit Amount Decimal** is required.",
      propDefinition: [
        app,
        "unitAmount",
      ],
    },
    defaultPriceDataUnitAmountDecimal: {
      propDefinition: [
        app,
        "unitAmountDecimal",
      ],
    },
    active: {
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
    defaultPriceDataCurrency: {
      propDefinition: [
        app,
        "currency",
        ({ country }) => ({
          country,
        }),
      ],
    },
    defaultPriceDataRecurringInterval: {
      label: "Default Price Recurring Interval",
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
      default_price_data: {
        currency: defaultPriceDataCurrency,
        recurring: {
          interval: defaultPriceDataRecurringInterval,
        },
        unit_amount: defaultPriceDataUnitAmount,
        unit_amount_decimal: defaultPriceDataUnitAmountDecimal,
      },
    });

    $.export("$summary", `Successfully created a new product with ID ${response.id}`);

    return response;
  },
};
