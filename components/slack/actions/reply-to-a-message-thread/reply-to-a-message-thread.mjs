import slack from "../../slack.app.mjs";

export default {
  key: "slack-reply-to-a-message",
  name: "Reply to a Message Thread",
  description: "Send a message as a threaded reply",
  version: "0.1.1",
  type: "action",
  props: {
    slack,
    thread_ts: {
      propDefinition: [
        slack,
        "thread_ts",
      ],
      optional: false,
    },
    reply_channel: {
      propDefinition: [
        slack,
        "reply_channel",
      ],
      optional: false,
    },
    text: {
      propDefinition: [
        slack,
        "text",
      ],
      optional: false,
    },
    as_user: {
      propDefinition: [
        slack,
        "as_user",
      ],
    },
    username: {
      propDefinition: [
        slack,
        "username",
      ],
    },
    icon_emoji: {
      propDefinition: [
        slack,
        "icon_emoji",
      ],
    },
    icon_url: {
      propDefinition: [
        slack,
        "icon_url",
      ],
    },
  },
  async run() {
    return await this.slack.sdk().chat.postMessage({
      text: this.text,
      channel: this.reply_channel,
      thread_ts: this.thread_ts,
      as_user: this.as_user,
      username: this.username,
      icon_emoji: this.icon_emoji,
      icon_url: this.icon_url,
    });
  },
};
