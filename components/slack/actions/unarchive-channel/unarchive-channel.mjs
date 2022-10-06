import slack from "../../slack.app.mjs";

export default {
  key: "slack-unarchive-channel",
  name: "Unarchive Channel",
  description: "Unarchive a channel. [See docs here](https://api.slack.com/methods/conversations.unarchive)",
  version: "0.0.6",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
  },
  async run() {
    return await this.slack.sdk().conversations.unarchive({
      channel: this.conversation,
    });
  },
};
