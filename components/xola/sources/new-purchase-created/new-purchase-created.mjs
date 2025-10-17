import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-new-purchase-created",
  name: "New Purchase Created",
  description: "Emit new event when a new purchase is created. [See the documentation](https://xola.github.io/xola-docs/#tag/purchases/operation/listPurchases)",
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
        id: purchase.id,
        summary: `New Purchase: ${purchase.id}`,
        ts: Date.parse(purchase.createdAt),
      };
    },
    async processEvent() {
      const lastCreatedAt = this._getLastCreatedAt();
      let maxCreatedAt = lastCreatedAt;
      const params = this.getParams();

      const { data } = await this.getResourceFn()({
        params,
      });

      const filteredPurchases = data.filter((purchase) => {
        const createdAt = purchase.createdAt;
        return !lastCreatedAt || new Date(createdAt) > new Date(lastCreatedAt);
      });

      filteredPurchases.forEach((purchase) => {
        const createdAt = purchase.createdAt;
        if (!maxCreatedAt || new Date(createdAt) > new Date(maxCreatedAt)) {
          maxCreatedAt = createdAt;
        }
        const meta = this.generateMeta(purchase);
        this.$emit(purchase, meta);
      });

      if (maxCreatedAt) {
        this._setLastCreatedAt(maxCreatedAt);
      }
    },
  },
  sampleEmit,
};
