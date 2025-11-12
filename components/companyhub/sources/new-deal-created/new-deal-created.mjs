import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "companyhub-new-deal-created",
  name: "New Deal Created",
  description: "Emit new event when a new deal is created. [See the documentation](https://companyhub.com/docs/api-documentation)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.companyhub.listDeals;
    },
    getSummary(item) {
      return `New Deal: ${item.Name}`;
    },
  },
  sampleEmit,
};
