import { axios } from "@pipedream/platform";
import stripe from "stripe";

const createOptionsMethod = (collectionOrFn, keysOrFn) => async function ({
  prevContext, ...opts
}) {
  let { startingAfter } = prevContext;
  let result;
  if (typeof collectionOrFn === "function") {
    result = await collectionOrFn.call(this, {
      prevContext,
      ...opts,
    });
  } else {
    result = await this.sdk()[collectionOrFn].list({
      starting_after: startingAfter,
    });
  }

  let options;
  if (typeof keysOrFn === "function") {
    options = result.data.map(keysOrFn.bind(this));
  } else {
    options = result.data.map((obj) => ({
      value: obj[keysOrFn[0]],
      label: obj[keysOrFn[1]],
    }));
  }

  startingAfter = options?.[options.length - 1]?.value;

  return {
    options,
    context: {
      startingAfter,
    },
  };
};

export default {
  type: "app",
  app: "stripe",
  propDefinitions: {
    productName: {
      type: "string",
      label: "Product Name",
      description: "The name of the product",
    },
    productActive: {
      type: "boolean",
      label: "Product Active",
      description: "Whether the product is available for purchase",
      default: true,
    },
    priceUnitAmount: {
      type: "integer",
      label: "Price Unit Amount",
      description: "A positive integer in cents (or 0 for a free price) representing how much to charge",
    },
    priceCurrency: {
      type: "string",
      label: "Price Currency",
      description: "Three-letter ISO currency code, in lowercase. Must be a [supported currency](https://stripe.com/docs/currencies)",
      default: "usd",
    },
    priceRecurringInterval: {
      type: "string",
      label: "Price Recurring Interval",
      description: "Specifies the billing cycle for the price",
      options: ["day", "week", "month", "year"],
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product that this price will belong to",
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    sdk() {
      return stripe(this._apiKey(), {
        apiVersion: "2020-03-02",
        maxNetworkRetries: 2,
      });
    },
    async createProduct({ name, active }) {
      return this.sdk().products.create({
        name,
        active,
      });
    },
    async createPrice({ unitAmount, currency, recurring, productId }) {
      return this.sdk().prices.create({
        unit_amount: unitAmount,
        currency,
        recurring: { interval: recurring },
        product: productId,
      });
    },
  },
};