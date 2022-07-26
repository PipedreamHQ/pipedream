import base from "../common/webhooks.mjs";

export default {
  ...base,
  key: "telegram_bot_api-channel-updates",
  name: "New Channel Updates (Instant)",
  description: "Emit new event each time a channel post is created or updated.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getEventTypes() {
      return [
        "channel_post",
        "edited_channel_post",
      ];
    },
    getMeta(event, channelPost) {
      return {
        id: event.update_id,
        summary: `${channelPost.chat.title} - ${channelPost.text}`,
        ts: new Date(channelPost.edit_date ?? channelPost.date),
      };
    },
    processEvent(event) {
      const channelPost = event.edited_channel_post ?? event.channel_post;

      if (!channelPost?.chat) {
        throw new Error(`Expected event to contain a chat, but received: ${JSON.stringify(event)}`);
      }

      this.$emit(event, this.getMeta(event, channelPost));
    },
  },
};
