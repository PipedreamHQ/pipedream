import common from "../common/common.mjs";

export default {
  ...common,
  key: "salesflare-new-workflow",
  name: "New Workflow Event",
  description: "Emit new events when new workflows are created. [See the docs](https://api.salesflare.com/docs#operation/getWorkflows)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getWorkflows;
    },
    getSummary(item) {
      return `New workflow ${item.name} (ID: ${item.id})`;
    },
  },
};
