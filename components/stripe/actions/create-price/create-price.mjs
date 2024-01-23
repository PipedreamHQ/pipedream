import stripeApp from "../../stripe.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "stripe-create-price",
  name: "Create a Price",
  description: "Creates a new price for an existing product. The price can be recurring or one-time. [See the documentation](https://stripe.com/docs/api/prices/create)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    stripeApp,
    productId: {
      propDefinition: [
        stripeApp,
        "productId",
      ],
    },
    priceUnitAmount: {
      propDefinition: [
        stripeApp,
        "priceUnitAmount",
      ],
    },
    priceCurrency: {
      propDefinition: [
        stripeApp,
        "priceCurrency",
      ],
    },
    priceRecurringInterval: {
      propDefinition: [
        stripeApp,
        "priceRecurringInterval",
      ],
      optional: true,
    },
    priceActive: {
      type: "boolean",
      label: "Price Active",
      description: "Whether the price is available for purchase",
      default: true,
      optional: true,
    },
  },
  methods: {
    ...stripeApp.methods,
  },
  async run({ $ }) {
    const priceData = {
      unit_amount: this.priceUnitAmount,
      currency: this.priceCurrency,
      product: this.productId,
      active: this.priceActive,
    };

    if (this.priceRecurringInterval) {
      priceData.recurring = { interval: this.priceRecurringInterval };
    }

    const response = await this.stripeApp.createPrice(priceData);

    $.export("$summary", `Successfully created a new price with ID ${response.id}`);
    return response;
  },
};