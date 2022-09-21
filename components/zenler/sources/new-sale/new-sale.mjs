import common from "../common.mjs";

export default {
  ...common,
  key: "zenler-new-sale",
  name: "New Sale",
  description: "Emit new event when a sale is created. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#5b964b29-b972-ec8e-3e65-df2ff33a6ad8)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zenler.getSalesBrief;
    },
    getResourceFnArgs() {
      return {};
    },
    resourceFilter(resource) {
      const lastCreatedAt = this.getLastCreatedAt() || 0;
      return Date.parse(resource.created_at) > lastCreatedAt;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `Sale ID ${resource.id}`,
      };
    },
  },
};
