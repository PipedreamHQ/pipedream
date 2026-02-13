import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "reward_sciences-new-participant-added",
  name: "New Participant Added",
  description: "Emit new event when a new participant is added to Reward Sciences. [See the documentation](https://developers.rewardsciences.com/api/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResults(lastId, max) {
      const { data: results } = await this.rewardSciences.listParticipants({
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
    generateMeta(participant) {
      return {
        id: participant.id,
        summary: `New Participant with ID: ${participant.id}`,
        ts: Date.now(),
      };
    },
  },
};
