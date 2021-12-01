// eslint-disable-next-line camelcase
const telegram_bot_api = require("../../telegram_bot_api.app.js");

module.exports = {
  type: "source",
  key: "telegram_bot_api-channel-updates",
  name: "Channel Updates (Instant)",
  description: "Emit new event each time a channel message is created or updated.",
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
  },
  hooks: {
    async activate() {
      await this.telegram_bot_api.createHook(this.http.endpoint, [
        "channel_post",
        "edited_channel_post",
      ]);
    },
    async deactivate() {
      await this.telegram_bot_api.deleteHook();
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
    this.$emit(body,
      {
        id: body.update_id,
        summary: `${body.channel_post.chat.title} - ${body.channel_post.text}`,
        ts: Date.now(),
      });
  },
};
