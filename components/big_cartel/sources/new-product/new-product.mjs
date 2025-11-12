import common from "../common.mjs";

export default {
  key: "big_cartel-new-product",
  name: "New Product Event",
  description: "Emit new events when a new product is created. [See the docs here](https://developers.bigcartel.com/api/v1#get-all-products)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getProducts;
    },
    getSummary(item) {
      return `New Product(ID:${item?.id}) ${item?.attributes?.name}`;
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
