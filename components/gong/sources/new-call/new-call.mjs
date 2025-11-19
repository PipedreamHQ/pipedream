import common from "../common/polling.mjs";

export default {
  ...common,
  key: "gong-new-call",
  name: "New Call",
  description: "Emit new event when a new call is added. [See the documentation](https://us-66463.app.gong.io/settings/api/documentation#get-/v2/calls)",
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "calls";
    },
    getResourceFn() {
      return this.app.listCalls;
    },
    getResourceFnArgs() {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return {
        params: {
          fromDateTime: this.getLastCreatedAt() || oneDayAgo.toISOString(),
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Call: ${resource.id}`,
        ts: Date.parse(resource.started),
      };
    },
  },
};
