import common from "../common/base.mjs";

export default {
  ...common,
  key: "growsurf-campaign-completed",
  name: "Campaign Completed",
  description: "Emit new event when a campaign is completed. [See the documentation](https://docs.growsurf.com/developer-tools/rest-api/api-reference#get-campaigns)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResources() {
      const { campaigns } = await this.growsurf.listCampaigns();
      return campaigns.filter((campaign) => campaign.status === "COMPLETE");
    },
    generateMeta(campaign) {
      return {
        id: campaign.id,
        summary: `Campaign Completed: ${campaign.name}`,
        ts: Date.now(),
      };
    },
  },
};
