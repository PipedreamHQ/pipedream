import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-purchase-updated",
  name: "Purchase Updated",
  description: "Emit new event when a purchase is updated. [See the documentation](https://xola.github.io/xola-docs/#tag/purchases/operation/listPurchases)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.listPurchases;
    },
    getParams() {
      return {
        limit: 100,
        skip: 0,
      };
    },
    generateMeta(purchase) {
      return {
        id: `${purchase.id}-${purchase.updatedAt}`,
        summary: `Purchase Updated: ${purchase.id}`,
        ts: Date.parse(purchase.updatedAt),
      };
    },
    async processEvent() {
      const lastUpdatedAt = this._getLastUpdatedAt();
      let maxUpdatedAt = lastUpdatedAt;
      const params = this.getParams();

      const { data } = await this.getResourceFn()({
        params,
      });

      const filteredPurchases = data.filter((purchase) => {
        const updatedAt = purchase.updatedAt;
        const createdAt = purchase.createdAt;
        return updatedAt !== createdAt
          && purchase.status !== "deleted"
          && (!lastUpdatedAt || new Date(updatedAt) > new Date(lastUpdatedAt));
      });

      filteredPurchases.forEach((purchase) => {
        const updatedAt = purchase.updatedAt;
        if (!maxUpdatedAt || new Date(updatedAt) > new Date(maxUpdatedAt)) {
          maxUpdatedAt = updatedAt;
        }
        const meta = this.generateMeta(purchase);
        this.$emit(purchase, meta);
      });

      if (maxUpdatedAt) {
        this._setLastUpdatedAt(maxUpdatedAt);
      }
    },
  },
  sampleEmit,
};
