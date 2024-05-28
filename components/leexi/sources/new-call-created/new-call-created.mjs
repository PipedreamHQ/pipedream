import common from "../common/polling.mjs";

export default {
  ...common,
  key: "leexi-new-call-created",
  name: "New Call Created",
  description: "Emit new event when a new call is created. [See the documentation](https://developer.leexi.ai/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "data";
    },
    getResourcesFn() {
      return this.app.listCalls;
    },
    getResourcesFnArgs() {
      return {
        params: {
          from: this.getLastCreatedAt(),
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.uuid,
        summary: `New Call: ${resource.direction}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
