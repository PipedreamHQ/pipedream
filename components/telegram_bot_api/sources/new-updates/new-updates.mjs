import base from "../common/webhooks.mjs";

export default {
  ...base,
  key: "telegram_bot_api-new-updates",
  name: "New Updates (Instant)",
  description: "Emit new event for each new Telegram event.",
  version: "0.1.3",
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
      const {
        update_id: id,
        ...eventDetails
      } = event;
      const eventType = Object.keys(eventDetails).pop();
      const summary = `New ${eventType} update: ${id}`;
      const ts = eventDetails[eventType].edit_date ?? eventDetails[eventType].date;

      return {
        id,
        summary,
        ts,
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
