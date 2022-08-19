import common from "../common/pipeline-based.mjs";

export default {
  ...common,
  key: "streak-box-changed-pipeline",
  name: "Box Changed Pipeline (Instant)",
  description: "Emit new event when a box changes pipelines.",
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
      return "BOX_CHANGE_PIPELINE";
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
