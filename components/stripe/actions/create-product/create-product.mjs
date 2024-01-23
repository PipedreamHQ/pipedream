import stripeApp from "../../stripe.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "stripe-create-product",
  name: "Create a Stripe Product",
  description: "Creates a new product object in Stripe. [See the documentation](https://stripe.com/docs/api/products/create)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    stripe: stripeApp,
    productName: {
      propDefinition: [
        stripeApp,
        "productName",
      ],
    },
    productActive: {
      propDefinition: [
        stripeApp,
        "productActive",
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
    },
  },
  async run({ $ }) {
    const product = await this.stripe.createProduct({
      name: this.productName,
      active: this.productActive,
    });

    const price = await this.stripe.createPrice({
      unitAmount: this.priceUnitAmount,
      currency: this.priceCurrency,
      recurring: this.priceRecurringInterval,
      productId: product.id,
    });

    $.export("$summary", `Created product ${product.name} with ID ${product.id} and price ID ${price.id}`);
    return {
      product,
      price,
    };
  },
};