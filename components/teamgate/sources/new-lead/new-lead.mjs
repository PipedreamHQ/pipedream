import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Lead",
  key: "teamgate-new-lead",
  description: "Emit new event when a new lead is created. [See docs here](https://developers.teamgate.com/#4a60be88-9991-41d2-8949-7a0f47319c80)",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getSummary(name, id) {
      return `New lead created: ${name} (${id})`;
    },
    getFunc() {
      return this.teamgate.listLeads;
    },
  },
};
