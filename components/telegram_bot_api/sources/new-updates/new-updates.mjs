// eslint-disable-next-line camelcase
import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-new-updates",
  name: "New Updates (Instant)",
  description: "Emit new event for each new Telegram event.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    http: {
      label: "HTTP Responder",
      description: "Exposes a `respond()` method that lets the source issue HTTP responses",
      type: "$.interface.http",
      customResponse: true,
    },
    telegramBotApi,
    updateTypes: {
      propDefinition: [
        telegramBotApi, // eslint-disable-line camelcase
        "updateTypes",
      ],
    },
  },
  hooks: {
    async activate() {
      await this.telegramBotApi.createHook(this.http.endpoint, this.updateTypes);
    },
    async deactivate() {
      await this.telegramBotApi.deleteHook();
    },
  },
  methods: {
    getMeta(body) {
      let summary;
      if (body.message.from)
        summary = `Update from ${body.message.from.first_name} ${body.message.from.last_name}`;
      else
        summary = `Update ID ${body.update_id}`;
      return {
        id: body.update_id,
        summary,
        ts: Date.now(),
      };
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
    this.$emit(body, this.getMeta(body));
  },
};
