import common from "../common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "big_cartel-new-order",
  name: "New Order Event",
  description: "Emit new events when a new order is created. [See the docs here](https://developers.bigcartel.com/api/v1#get-all-orders)",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getOrders;
    },
    getSummary(item) {
      return `New Order(ID:${item?.id}) `;
    },
    getResourceKey() {
      return "data";
    },
    compareFn(item) {
      return new Date(item?.attributes?.created_at).getTime() > this.getLastFetchTime();
    },
    getDate(item) {
      return item?.attributes?.created_at;
    },
  },
  sampleEmit,
};
