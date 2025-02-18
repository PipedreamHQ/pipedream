import common from "../common/base.mjs";

export default {
  ...common,
  key: "salespype-new-campaign-created",
  name: "New Campaign Created",
  description: "Emit new events when a new campaign is created. [See the documentation](https://documenter.getpostman.com/view/5101444/2s93Y3u1Eb#f6b1d9d0-0251-4b6c-b70e-699b35f59a39)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.salespype.listCampaigns;
    },
    getResourceKey() {
      return "campaigns";
    },
    getFieldValue(campaign) {
      return campaign.id;
    },
    generateMeta(campaign) {
      return {
        id: campaign.id,
        summary: `New Campaign: ${campaign.id}`,
        ts: Date.now(),
      };
    },
  },
};
