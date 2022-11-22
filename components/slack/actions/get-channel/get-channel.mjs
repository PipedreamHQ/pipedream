import slack from "../../slack.app.mjs";

export default {
  key: "slack-get-channel",
  name: "Get Channel",
  description: "Return information about a workspace channel. [See docs here](https://api.slack.com/methods/conversations.info)",
  version: "0.0.8",
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
    return await this.slack.sdk().conversations.info({
      channel: this.conversation,
    });
  },
};
