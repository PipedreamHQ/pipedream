import common from "../common/pipeline-based.mjs";

export default {
  ...common,
  key: "streak-new-box",
  name: "New Box (Instant)",
  description: "Emit new event when a new box is created in a pipeline.",
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
          sortBy: "creationTimestamp",
        },
      });
    },
    getEventType() {
      return "BOX_CREATE";
    },
    generateMeta(box) {
      return {
        id: box.key.slice(-72),
        summary: box.name,
        ts: box.creationTimestamp,
      };
    },
  },
};
