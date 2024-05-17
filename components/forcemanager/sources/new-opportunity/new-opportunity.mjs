import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "forcemanager-new-opportunity",
  name: "New Opportunity",
  description: "Emit new event when a new opportunity is created. [See the documentation](https://developer.forcemanager.com/#742a3f5b-4701-46e8-b6bd-36488e233752)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.forcemanager.listOpportunities;
    },
    getSummary(opportunity) {
      return `New Opportunity: ${opportunity.reference}`;
    },
  },
  sampleEmit,
};
