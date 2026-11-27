import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import {
  hashId, toLegacyProductId,
} from "../../common/utils.mjs";
import googleMerchantCenter from "../../google_merchant_center.app.mjs";

export default {
  key: "google_merchant_center-new-product-added",
  name: "New Product Added",
  description: "Emit new event when a new product is added. [See the documentation](https://developers.google.com/merchant/api/reference/rest/products_v1/accounts.products/list)",
  version: "1.0.0",
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
  },
  methods: {
    _getSavedIds() {
      return this.db.get("savedIds") || [];
    },
    _setSavedIds(value) {
      this.db.set("savedIds", value);
    },
    async getResources() {
      const products = [];
      for await (const product of this.googleMerchantCenter.paginateProducts()) {
        products.push(product);
      }
      return products;
    },
  },
  hooks: {
    async deploy() {
      const products = await this.getResources();
      this._setSavedIds(products.map(({ name }) => name));
    },
  },
  async run() {
    const products = await this.getResources();
    const savedIds = new Set(this._getSavedIds());

    // Migrate IDs saved by the Content API version of this source
    products
      .filter((product) => savedIds.has(toLegacyProductId(product)))
      .forEach(({ name }) => savedIds.add(name));

    products
      .filter(({ name }) => !savedIds.has(name))
      .forEach((product) => {
        const { name } = product;
        this.$emit(product, {
          id: hashId(name),
          summary: `New Product: "${product.productAttributes?.title ?? product.offerId}"`,
          ts: Date.parse(product.productStatus?.creationDate) || Date.now(),
        });
        savedIds.add(name);
      });

    this._setSavedIds(products.map(({ name }) => name));
  },
};
