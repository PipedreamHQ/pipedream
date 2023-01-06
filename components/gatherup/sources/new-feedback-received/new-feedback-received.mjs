import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Feedback Received",
  version: "0.0.2",
  key: "gatherup-new-feedback-received",
  description: "Emit new event on each new feedback received.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      this.$emit(data, {
        id: data.feedbackId,
        summary: `New feedback received with id ${data.feedbackId}`,
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
