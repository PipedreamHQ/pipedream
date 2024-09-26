import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  type: "source",
  key: "relavate-new-affiliate-campaign",
  name: "New Affiliate Campaign",
  description: "Emit new event when a new affiliate campaign is created.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.relavate.listCampaigns;
    },
    getSummary(campaign) {
      return `New campaign: ${campaign.name}`;
    },
  },
  sampleEmit,
};
