import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "onepagecrm-new-deal-closed",
  name: "New Deal Closed",
  description: "Emit new event when a deal is successfully closed in the CRM.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getField() {
      return "deal";
    },
    getFilterField() {
      return "close_date";
    },
    getFunction() {
      return this.onepagecrm.listDeals;
    },
    getParams() {
      return {
        status: "closed",
        sort_by: "close_date",
        order: "desc",
      };
    },
    getSummary(item) {
      return `A new deal with ID: ${item.id} was successfully closed!`;
    },
  },
  sampleEmit,
};
