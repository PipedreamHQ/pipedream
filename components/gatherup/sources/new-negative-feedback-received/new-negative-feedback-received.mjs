import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Negative Feedback Received",
  version: "0.0.1",
  key: "gatherup-new-negative-feedback-received",
  description: "Emit new event on each new negative feedback received.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      if (data.recommend >= 7) return;

      this.$emit(data, {
        id: data.feedbackId,
        summary: `New negative feedback received with id ${data.feedbackId}`,
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
