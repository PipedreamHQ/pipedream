import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Time Entry (Instant)",
  version: "0.0.1",
  key: "awork-new-time-entry",
  description: "Emit new event on each created time entry.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "timetracking_added";
    },
    emitEvent(body) {
      const data = body.entity;

      this.$emit(data, {
        id: data.id,
        summary: `New time entry created with id ${data.id}`,
        ts: Date.parse(data.createdOn),
      });
    },
  },
};
