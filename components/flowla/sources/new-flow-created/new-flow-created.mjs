import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "flowla-new-flow-created",
  name: "New Flow Created",
  description: "Emit new event when a new flow is created in Flowla. [See the documentation](https://api.flowla.com/docs#/default/ApiV1Controller_flows)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.flowla.listFlows;
    },
    getTsField() {
      return "createdAt";
    },
    generateMeta(flow) {
      return {
        id: flow.id,
        summary: `New Flow Created: ${flow.title}`,
        ts: Date.parse(flow.createdAt),
      };
    },
  },
};
