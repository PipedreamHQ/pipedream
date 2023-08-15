import common from "../common/polling.mjs";

export default {
  ...common,
  key: "precisefp-new-pdf-engagement",
  name: "New PDF Engagement",
  description: "Trigger when a new PDF engagement is created. [See the documentation](https://documenter.getpostman.com/view/6125750/UyrDEFnd#a12ecac7-6f7c-46bf-97b6-264479078474)",
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
