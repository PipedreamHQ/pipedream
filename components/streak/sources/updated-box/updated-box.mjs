import common from "../common/pipeline-based.mjs";

export default {
  ...common,
  key: "streak-updated-box",
  name: "Updated Box (Instant)",
  description: "Emit new event when a box is updated in a pipeline.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents(limit) {
      return this.streak.listBoxes({
        pipelineId: this.pipelineId,
        params: {
          limit,
          sortBy: "lastUpdatedTimestamp",
        },
      });
    },
    getEventType() {
      return "BOX_EDIT";
    },
    generateMeta(box) {
      return {
        id: box.lastUpdatedTimestamp,
        summary: box.name,
        ts: box.lastUpdatedTimestamp,
      };
    },
  },
};
