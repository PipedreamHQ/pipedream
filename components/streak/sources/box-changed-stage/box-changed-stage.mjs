import common from "../common/pipeline-based.mjs";

export default {
  ...common,
  key: "streak-box-changed-stage",
  name: "Box Changed Stage (Instant)",
  description: "Emit new event when a box's stage is updated in a pipeline.",
  version: "0.0.1",
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
      return "BOX_CHANGE_STAGE";
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
