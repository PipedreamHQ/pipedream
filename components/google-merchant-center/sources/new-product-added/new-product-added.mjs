import googleShoppingApp from "../../google-merchant-center.app.mjs";
import { axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "google-merchant-center-new-product-added",
  name: "New Product Added",
  description: "Emits an event each time a new product is added to your Google Merchant Center account. [See the documentation](https://developers.google.com/shopping-content/reference/rest/v2.1/products/list)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    googleShopping: {
      type: "app",
      app: "google_shopping",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    merchantId: {
      propDefinition: [
        googleShoppingApp,
        "merchantId",
      ],
    },
  },
  methods: {
    _getLastProductId() {
      return this.db.get("lastProductId") || null;
    },
    _setLastProductId(productId) {
      this.db.set("lastProductId", productId);
    },
  },
  hooks: {
    async deploy() {
      // Fetch the last 50 products to backfill events
      let pageToken;
      let products = [];
      do {
        const response = await this.googleShopping.listProducts({
          merchantId: this.merchantId,
          pageToken,
        });
        products = response.resources;
        pageToken = response.nextPageToken;
      } while (pageToken && products.length < 50);

      // Emit events for the last 50 products
      for (const product of products.slice(0, 50)) {
        this.$emit(product, {
          id: product.id,
          summary: `New Product: ${product.title}`,
          ts: Date.parse(product.creationDate),
        });
      }

      // Store the ID of the last product
      if (products.length > 0) {
        this._setLastProductId(products[0].id);
      }
    },
  },
  async run() {
    let pageToken;
    let hasMore = true;
    let lastProductId = this._getLastProductId();

    while (hasMore) {
      const response = await this.googleShopping.listProducts({
        merchantId: this.merchantId,
        pageToken,
      });
      const products = response.resources;
      hasMore = !!response.nextPageToken;
      pageToken = response.nextPageToken;

      for (const product of products) {
        if (product.id === lastProductId) {
          hasMore = false;
          break;
        }
        this.$emit(product, {
          id: product.id,
          summary: `New Product: ${product.title}`,
          ts: Date.parse(product.creationDate),
        });
      }
    }

    // Update the last product ID
    if (products.length > 0) {
      this._setLastProductId(products[0].id);
    }
  },
};