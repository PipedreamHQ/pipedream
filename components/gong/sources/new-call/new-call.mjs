import common from "../common/polling.mjs";

export default {
  ...common,
  key: "gong-new-call",
  name: "New Call",
  description: "Triggers when a new call is added. [See the documentation](https://us-66463.app.gong.io/settings/api/documentation#get-/v2/calls)",
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
