import common from "../common/base.mjs";

export default {
  ...common,
  key: "wp_maps-new-product-created",
  name: "New Product Created",
  description: "Emit new event when a new product is created in WP Maps. [See the documentation](https://support.agilelogix.com/hc/en-us/articles/900006795363-API-Access-Points#get-all-products)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.wpMaps.listProducts;
    },
    generateMeta(product) {
      return {
        id: product.id,
        summary: product.title,
        ts: Date.now(),
      };
    },
  },
};
