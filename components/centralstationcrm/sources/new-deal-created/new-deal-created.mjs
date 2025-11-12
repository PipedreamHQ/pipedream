import common from "../common/base.mjs";

export default {
  ...common,
  key: "centralstationcrm-new-deal-created",
  name: "New Deal Created",
  description: "Emit new event when a new deal is created in CentralStationCRM.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.centralstationcrm.listDeals;
    },
    getResourceType() {
      return "deal";
    },
    generateMeta(deal) {
      return {
        id: deal.id,
        summary: deal.name,
        ts: Date.parse(deal.created_at),
      };
    },
  },
};
