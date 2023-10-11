import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import googleMerchantCenter from "../../google-merchant-center.app.mjs";

export default {
  key: "google-merchant-center-new-product-added",
  name: "New Product Added",
  description: "Emit new event when a new product is added",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    googleMerchantCenter,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    merchantId: {
      propDefinition: [
        googleMerchantCenter,
        "merchantId",
      ],
    },
  },
  methods: {
    _getProductId() {
      return this.db.get("productId") || "";
    },
    _setProductId(productId) {
      this.db.set("productId", productId);
    },
  },
  hooks: {
    async deploy() {
      // Fetch the current products
      const products = await this.googleMerchantCenter.listProducts({
        merchantId: this.merchantId,
      });

      if (products.resources.length > 0) {
        // Store the ID of the last product for future runs
        this._setProductId(products.resources[0].id);
      }
    },
  },
  async run() {
    // Fetch the current products
    const products = await this.googleMerchantCenter.listProducts({
      merchantId: this.merchantId,
    });

    // Get the ID of the last product we processed
    const lastProductId = this._getProductId();

    // Process the new products
    for (const product of products.resources) {
      if (product.id === lastProductId) {
        break;
      }

      this.$emit(product, {
        id: product.id,
        summary: `New Product: ${product.title}`,
        ts: Date.now(),
      });

      // Store the ID of the last product for future runs
      this._setProductId(product.id);
    }
  },
};
