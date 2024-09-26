import commonOrderSources from "../common/common-order-sources.mjs";

export default {
  ...commonOrderSources,
  type: "source",
  key: "order_desk-new-order-created",
  name: "New Order Created",
  description: "Emit new event a new order is created",
  version: "0.0.1",
  methods: {
    ...commonOrderSources.methods,
    getParams() {
      const lastDate = this._getLastFetchDate();
      return {
        search_start_date: lastDate,
      };
    },
    getMeta({
      id,
      date_added,
    }) {
      return {
        id: `${id}.${Date.now()}`,
        summary: `Created Order "${id}" at ${date_added}`,
        ts: date_added,
      };
    },
  },
};
