import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import googleMerchantCenter from "../../google_merchant_center.app.mjs";

export default {
  key: "google_merchant_center-new-product-added",
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
  },
  methods: {
    _getSavedIds() {
      return this.db.get("savedIds") || [];
    },
    _setSavedIds(value) {
      this.db.set("savedIds", value);
    },
    async getResources() {
      return this.googleMerchantCenter.listProducts();
    },
  },
  hooks: {
    async deploy() {
      const products = await this.getResources();
      this._setSavedIds(products?.map?.(({ id }) => id) ?? []);
    },
  },
  async run() {
    const products = await this.getResources();
    const savedIds = this._getSavedIds();

    products
      ?.filter?.(({ id }) => !savedIds.includes(id))
      .forEach((product) => {
        const { id } = product;
        this.$emit(product, {
          id,
          summary: `New Product: "${product.title ?? id}"`,
          ts: Date.now(),
        });
        savedIds.push(id);
      });

    this._setSavedIds(savedIds);
  },
};
