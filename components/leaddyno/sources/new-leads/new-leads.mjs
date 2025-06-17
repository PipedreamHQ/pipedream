import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "leaddyno-new-leads",
  name: "New Leads",
  description: "Emit new event when a new lead is created in LeadDyno. [See the documentation](https://app.theneo.io/leaddyno/leaddyno-rest-api/leads/list-all-leads)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.leaddyno.listLeads;
    },
    getSummary(item) {
      return `New Lead: ${item.email}`;
    },
  },
  sampleEmit,
};
