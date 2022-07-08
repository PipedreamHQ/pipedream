import base from "../common/webhooks.mjs";

export default {
  ...base,
  key: "telegram_bot_api-new-updates",
  name: "New Updates (Instant)",
  description: "Emit new event for each new Telegram event.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    updateTypes: {
      propDefinition: [
        base.props.telegramBotApi,
        "updateTypes",
      ],
    },
  },
  methods: {
    ...base.methods,
    getMeta(event) {
      const { update_id: id } = event;
      const summary = event.message.from
        ? `Update from ${event.message.from.first_name} ${event.message.from.last_name}`
        : `Update ID ${id}`;

      return {
        id,
        summary,
        ts: Date.now(),
      };
    },
    getEventTypes() {
      return this.updateTypes;
    },
    processEvent(event) {
      this.$emit(event, this.getMeta(event));
    },
  },
};
