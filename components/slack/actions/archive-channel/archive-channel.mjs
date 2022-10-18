import slack from "../../slack.app.mjs";

export default {
  key: "slack-archive-channel",
  name: "Archive Channel",
  description: "Archive a channel. [See docs here](https://api.slack.com/methods/conversations.archive)",
  version: "0.0.7",
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
    return await this.slack.sdk().conversations.archive({
      channel: this.conversation,
    });
  },
};
