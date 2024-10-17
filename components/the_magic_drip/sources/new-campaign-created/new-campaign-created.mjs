import common from "../common.mjs";

export default {
  ...common,
  key: "the_magic_drip-new-campaign-created",
  name: "New Campaign Created",
  description: "Emit new event when a campaign is created. [See the documentation](https://docs.themagicdrip.com/api-reference/endpoint/get-v1campaign)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getItems() {
      const { campaigns } = await this.app.listCampaigns();
      return campaigns;
    },
    getItemId(item) {
      return item.workflowId;
    },
    getItemMetadata(item) {
      return {
        summary: `New Campaign: ${item.name}`,
        ts: item.createdAt,
      };
    },
  },
};
