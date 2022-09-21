import common from "../common.mjs";

export default {
  ...common,
  key: "zenler-new-live-class-registration",
  name: "New Live Class Registration",
  description: "Emit new event when a new live class is registered. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#1966fea2-8274-49bd-f96d-54c215f9d303)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zenler.getLiveClasses;
    },
    getResourceFnArgs() {
      return {
        params: {
          orderby: "created_at",
          order: "asc",
        },
      };
    },
    resourceFilter(resource) {
      const lastCreatedAt = this.getLastCreatedAt() || 0;
      return Date.parse(resource.created_at) > lastCreatedAt;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `Live Class ID ${resource.id}`,
      };
    },
  },
};
