import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "sperse-new-lead",
  name: "New Lead",
  description: "Emit new event when a new lead is created. [See the documentation](https://app.sperse.com/app/api/swagger)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getLeads;
    },
    getResourceFnArgs() {
      return {
        params: {
          TopCount: constants.DEFAULT_MAX,
        },
      };
    },
    generateMeta(lead) {
      return {
        id: lead.id,
        summary: `New Lead: ${lead.name}`,
        ts: Date.now(),
      };
    },
  },
};
