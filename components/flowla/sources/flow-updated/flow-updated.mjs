import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "flowla-flow-updated",
  name: "Flow Updated",
  description: "Emit new event when a flow is updated in Flowla. [See the documentation](https://api.flowla.com/docs#/default/ApiV1Controller_flows)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.flowla.listFlows;
    },
    getTsField() {
      return "updatedAt";
    },
    generateMeta(flow) {
      const ts = Date.parse(flow.updatedAt);
      return {
        id: `${flow.id}-${ts}`,
        summary: `Flow Updated: ${flow.title}`,
        ts,
      };
    },
  },
};
