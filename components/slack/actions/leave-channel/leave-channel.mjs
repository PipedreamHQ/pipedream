import slack from "../../slack.app.mjs";

export default {
  key: "slack-leave-channel",
  name: "Leave Channel",
  description: "Leave an existing channel. [See docs here](https://api.slack.com/methods/conversations.leave)",
  version: "0.0.9",
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
    return await this.slack.sdk().conversations.leave({
      channel: this.conversation,
    });
  },
};
