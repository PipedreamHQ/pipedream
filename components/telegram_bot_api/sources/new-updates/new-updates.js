// eslint-disable-next-line camelcase
const telegram_bot_api = require("../../telegram_bot_api.app.js");

module.exports = {
  type: "source",
  key: "telegram_bot_api-new-updates",
  name: "New Updates (Instant)",
  description: "Emit new event for each new Telegram event.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    telegram_bot_api,
    updateTypes: {
      propDefinition: [
        telegram_bot_api, // eslint-disable-line camelcase
        "updateTypes",
      ],
    },
  },
  hooks: {
    async activate() {
      await this.telegram_bot_api.createHook(this.http.endpoint, this.updateTypes);
    },
    async deactivate() {
      await this.telegram_bot_api.deleteHook();
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
    if ((event.path).substring(1) !== this.telegram_bot_api.$auth.token) {
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
