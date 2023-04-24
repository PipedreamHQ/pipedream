import common from "../common/polling.mjs";

export default {
  ...common,
  key: "utradea-content-article-generated",
  name: "Content Article Generated",
  description: "Emit new event when a new content article is generated for a given stock or cryptocurrency. [See the documentation here](https://utradea.com/api-docs#content-notifications-*-new-140).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "resource";
    },
    getResourceFn() {
      return this.app.listResources;
    },
    getResourceFnArgs() {
      return {};
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Resource: ${resource.name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
