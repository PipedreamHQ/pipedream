import common from "../common/common.mjs";

export default {
  ...common,
  key: "salesflare-new-task",
  name: "New Task Event",
  description: "Emit new events when new tasks are created. [See the docs](https://api.salesflare.com/docs#operation/getTasks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getTasks;
    },
    getSummary(item) {
      return `New task (ID: ${item.id})`;
    },
  },
};
