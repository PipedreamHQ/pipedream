import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Relation Created (Instant)",
  version: "0.0.1",
  key: "laposta-new-relation-created",
  description: "Emit new event on each created relation. [See docs here (Go to `Add webhook`)](http://api.laposta.nl/doc/)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "subscribed";
    },
    emitEvent(data) {
      this.$emit(data, {
        id: data.member_id,
        summary: `New relation created with id ${data.member_id}`,
        ts: Date.parse(data.signup_date),
      });
    },
  },
};
