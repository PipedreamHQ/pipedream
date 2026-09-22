import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "reward_sciences-new-activity-added",
  name: "New Activity Added",
  description: "Emit new event when a new activity is added to Reward Sciences. [See the documentation](https://developers.rewardsciences.com/api/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getLastOffset() {
      return this.db.get("lastOffset") || 0;
    },
    _setLastOffset(lastOffset) {
      this.db.set("lastOffset", lastOffset);
    },
    async getResults(lastId, max) {
      const lastOffset = this._getLastOffset();
      let { data: results } = await this.rewardSciences.listActivities({
        params: {
          offset: lastOffset,
          limit: max || 100,
        },
      });
      if (!results?.length) {
        return {
          results: [],
          newLastId: lastId,
        };
      }
      const newLastId = results[results.length - 1].id;
      this._setLastOffset(lastOffset + results.length);
      results = results.filter((result) => result.id > lastId);
      if (max && results.length > max) {
        results = results.slice(-1 * max);
      }
      return {
        results,
        newLastId,
      };
    },
    generateMeta(activity) {
      return {
        id: activity.id,
        summary: `New Activity with ID: ${activity.id}`,
        ts: Date.parse(activity.created_at),
      };
    },
  },
};
