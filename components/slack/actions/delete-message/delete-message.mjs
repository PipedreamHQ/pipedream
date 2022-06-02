import slack from "../../slack.app.mjs";

export default {
  key: "slack-delete-message",
  name: "Delete Message",
  description: "Delete a message. [See docs here](https://api.slack.com/methods/chat.delete)",
  version: "0.0.4",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    timestamp: {
      propDefinition: [
        slack,
        "timestamp",
      ],
    },
    as_user: {
      propDefinition: [
        slack,
        "as_user",
      ],
      description: "Pass true to update the message as the authed user. Bot users in this context are considered authed users.",
    },
  },
  async run() {
    return await this.slack.sdk().chat.delete({
      channel: this.conversation,
      ts: this.timestamp,
      as_user: this.as_user,
    });
  },
};
