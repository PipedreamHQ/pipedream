import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-purchase-canceled",
  name: "Purchase Canceled",
  description: "Emit new event when a purchase is canceled. [See the documentation](https://xola.github.io/xola-docs/#tag/purchases/operation/listPurchases)",
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
        status: "canceled",
      };
    },
    generateMeta(purchase) {
      return {
        id: purchase.id,
        summary: `Purchase Canceled: ${purchase.id}`,
        ts: Date.parse(purchase.updatedAt),
      };
    },
    async processEvent() {
      const processedIds = this._getProcessedIds();
      const newProcessedIds = [];
      const params = this.getParams();

      const { data } = await this.getResourceFn()({
        params,
      });

      const filteredPurchases = data.filter((purchase) => {
        return !processedIds.includes(purchase.id);
      });

      filteredPurchases.forEach((purchase) => {
        newProcessedIds.push(purchase.id);
        const meta = this.generateMeta(purchase);
        this.$emit(purchase, meta);
      });

      const updatedProcessedIds = [
        ...processedIds,
        ...newProcessedIds,
      ].slice(-1000);
      this._setProcessedIds(updatedProcessedIds);
    },
  },
  sampleEmit,
};
