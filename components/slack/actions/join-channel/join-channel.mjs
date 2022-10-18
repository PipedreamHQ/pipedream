import slack from "../../slack.app.mjs";

export default {
  key: "slack-join-channel",
  name: "Join Channel",
  description: "Join an existing channel. [See docs here](https://api.slack.com/methods/conversations.join)",
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
    return await this.slack.sdk().conversations.join({
      channel: this.conversation,
    });
  },
};
