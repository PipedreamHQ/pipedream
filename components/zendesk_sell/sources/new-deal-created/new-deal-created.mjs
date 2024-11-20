import common from "../common/base.mjs";

export default {
  ...common,
  key: "zendesk_sell-new-deal-created",
  name: "New Deal Created",
  description: "Emit new event when a new deal is created in Zendesk Sell.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zendeskSell.listDeals;
    },
    getSummary(deal) {
      return `New Deal ID: ${deal.id}`;
    },
  },
};
