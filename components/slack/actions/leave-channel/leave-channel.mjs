import slack from "../../slack.app.mjs";

export default {
  key: "slack-leave-channel",
  name: "Leave Channel",
  description: "Leave an existing channel",
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
    return await this.slack.sdk().conversations.leave({
      channel: this.conversation,
    });
  },
};
