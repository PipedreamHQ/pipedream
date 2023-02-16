import common from "../common/pipeline-based.mjs";

export default {
  ...common,
  key: "streak-new-email-on-box",
  name: "New Email on Box (Instant)",
  description: "Emit new event when an email is added to a box in a pipeline.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents(limit) {
      const boxes = await this.streak.listBoxes({
        pipelineId: this.pipelineId,
        params: {
          limit,
          sortBy: "lastUpdatedTimestamp",
        },
      });
      return boxes.filter((box) => box?.emailAddresses.length > 0);
    },
    getEventType() {
      return "BOX_NEW_EMAIL_ADDRESS";
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
