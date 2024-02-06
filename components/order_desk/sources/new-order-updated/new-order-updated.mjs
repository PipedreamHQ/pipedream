import commonOrderSources from "../common/common-order-sources.mjs";

export default {
  ...commonOrderSources,
  type: "source",
  key: "order_desk-new-order-updated",
  name: "New Order Updated",
  description: "Emit new event a new order is updated",
  version: "0.0.1",
  methods: {
    ...commonOrderSources.methods,
    getParams() {
      const lastDate = this._getLastFetchDate();
      return {
        modified_start_date: lastDate,
      };
    },
    getMeta({
      id,
      date_updated,
    }) {
      return {
        id: `${id}.${Date.now()}`,
        summary: `Updated Order "${id}" at ${date_updated}`,
        ts: date_updated,
      };
    },
  },
};
