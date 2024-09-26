import common from "../common/base.mjs";

export default {
  ...common,
  key: "wp_maps-new-store-created",
  name: "New Store Created",
  description: "Emit new event when a new store is created in WP Maps. [See the documentation](https://support.agilelogix.com/hc/en-us/articles/900006795363-API-Access-Points#get-all-stores)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.wpMaps.listStores;
    },
    generateMeta(store) {
      return {
        id: store.id,
        summary: store.title,
        ts: Date.now(),
      };
    },
  },
};
