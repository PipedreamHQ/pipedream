// eslint-disable-next-line camelcase
import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  type: "source",
  key: "telegram_bot_api-message-updates",
  name: "Message Updates (Instant)",
  description: "Emit new event each time a Telegram message is created or updated.",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    telegramBotApi,
  },
  hooks: {
    async activate() {
      await this.telegramBotApi.createHook(this.http.endpoint, [
        "message",
        "edited_message",
      ]);
    },
    async deactivate() {
      await this.telegramBotApi.deleteHook();
    },
  },
  async run(event) {
    if ((event.path).substring(1) !== this.telegramBotApi.$auth.token) {
      return;
    }
    this.http.respond({
      status: 200,
    });
    const { body } = event;
    if (!body) {
      return;
    }
    const message = body.edited_message ?? body.message;
    this.$emit(body,
      {
        id: body.update_id,
        summary: message.text,
        ts: Date.now(),
      });
  },
};
