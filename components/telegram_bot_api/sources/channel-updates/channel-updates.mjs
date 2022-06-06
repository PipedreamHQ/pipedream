// eslint-disable-next-line camelcase
import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  type: "source",
  key: "telegram_bot_api-channel-updates",
  name: "Channel Updates (Instant)",
  description: "Emit new event each time a channel message is created or updated.",
  version: "0.0.4",
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
        "channel_post",
        "edited_channel_post",
      ]);
    },
    async deactivate() {
      await this.telegramBotApi.deleteHook();
    },
  },
  async run(event) {
    // if the event doesn't contain the same API token secret,
    //   then it's an unauthorized replay attack.
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
    const channelPost = body.edited_channel_post ?? body.channel_post;

    if (!channelPost?.chat) {
      throw new Error(`Expected body to contain a chat, but received: ${JSON.stringify(body)}`);
    }

    this.$emit(body,
      {
        id: body.update_id,
        summary: `${channelPost.chat.title} - ${channelPost.text}`,
        ts: Date.now(),
      });
  },
};
