import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Positive Feedback Received",
  version: "0.0.2",
  key: "gatherup-new-positive-feedback-received",
  description: "Emit new event on each new positive feedback received.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      if (data.recommend <= 6) return;

      this.$emit(data, {
        id: data.feedbackId,
        summary: `New positive feedback received with id ${data.feedbackId}`,
        ts: Date.parse(data.dateOfReview),
      });
    },
    async getResources(args = {}) {
      const {
        data: resources, perPage,
      } = await this.gatherup.getFeedbacks(args);

      return {
        resources,
        perPage,
      };
    },
  },
};
