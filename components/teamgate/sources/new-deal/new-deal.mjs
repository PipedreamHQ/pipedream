import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Deal",
  key: "teamgate-new-deal",
  description: "Emit new event when a new deal is created. [See docs here](https://developers.teamgate.com/#8f23eadd-e356-4b45-bdbe-b1122da6f762)",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getSummary(name, id) {
      return `New deal created: ${name} (${id})`;
    },
    getFunc() {
      return this.teamgate.listDeals;
    },
  },
};
