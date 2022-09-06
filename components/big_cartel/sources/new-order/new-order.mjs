import app from "../../big_cartel.app.mjs";
import common from "../common.mjs";

export default {
  key: "big_cartel-new-order",
  name: "New Order Event",
  description: "Emit new events when a new order is created. [See the docs here](https://developers.bigcartel.com/api/v1#get-all-orders)",
  version: "0.0.1",
  type: "source",
  ...common,
  props: {
    app,
    ...common.props,
  },
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
};
