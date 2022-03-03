import slack from "../../slack.app.mjs";

export default {
  key: "slack-join-channel",
  name: "Join Channel",
  description: "Join an existing channel",
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
    return await this.slack.sdk().conversations.join({
      channel: this.conversation,
    });
  },
};
