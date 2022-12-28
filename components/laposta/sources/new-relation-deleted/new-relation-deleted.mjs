import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Relation Deleted (Instant)",
  version: "0.0.1",
  key: "laposta-new-relation-deleted",
  description: "Emit new event on each deleted relation.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "deactivated";
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.member_id,
        summary: `New relation deactivated with id ${data.member_id}`,
        ts: Date.parse(data.modified),
      });
    },
  },
};
