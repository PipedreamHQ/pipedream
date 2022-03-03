import slack from "../../slack.app.mjs";

export default {
  key: "slack-unarchive-channel",
  name: "Unarchive Channel",
  description: "Unarchive a channel",
  version: "0.0.2",
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
