import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Relation Updated (Instant)",
  version: "0.0.1",
  key: "laposta-new-relation-updated",
  description: "Emit new event on each updated relation.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "modified";
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.member_id,
        summary: `New relation updated with id ${data.member_id}`,
        ts: Date.parse(data.modified),
      });
    },
  },
};
