import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Updated Time Entry (Instant)",
  version: "0.0.1",
  key: "awork-new-updated-time-entry",
  description: "Emit new event on each updated time entry.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "timetracking_updated";
    },
    emitEvent(body) {
      const data = body.entity;

      this.$emit(data, {
        id: `${data.id}-${data.updatedOn}`,
        summary: `New time entry updated with id ${data.id}`,
        ts: Date.parse(data.createdOn),
      });
    },
  },
};
