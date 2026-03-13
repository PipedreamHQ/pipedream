import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "reward_sciences-new-campaign-created",
  name: "New Campaign Created",
  description: "Emit new event when a new campaign is created in Reward Sciences. [See the documentation](https://developers.rewardsciences.com/api/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResults(lastId, max) {
      const { data: results } = await this.rewardSciences.listCampaigns({
        params: {
          limit: max || 100,
          offset: 0,
        },
      });
      if (!results?.length) {
        return {
          results: [],
          newLastId: lastId,
        };
      }
      const newLastId = results[0].id;
      const filteredResults = results.filter((result) => result.id > lastId);
      return {
        results: filteredResults.reverse(),
        newLastId,
      };
    },
    generateMeta(campaign) {
      return {
        id: campaign.id,
        summary: `New Campaign with ID: ${campaign.id}`,
        ts: Date.now(),
      };
    },
  },
};
