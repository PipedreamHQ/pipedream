import base from "../common/webhooks.mjs";

export default {
  ...base,
  key: "telegram_bot_api-message-updates",
  name: "New Message Updates (Instant)",
  description: "Emit new event each time a Telegram message is created or updated.",
  version: "0.1.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getMeta(event, message) {
      return {
        id: event.update_id,
        summary: message.text,
        ts: new Date(message.edit_date ?? message.date),
      };
    },
    getEventTypes() {
      return [
        "message",
        "edited_message",
      ];
    },
    processEvent(event) {
      const message = event.edited_message ?? event.message;
      this.$emit(event, this.getMeta(event, message));
    },
  },
};
