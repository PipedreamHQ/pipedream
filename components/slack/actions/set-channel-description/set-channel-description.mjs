import slack from "../../slack.app.mjs";

export default {
  key: "slack-set-channel-description",
  name: "Set Channel Description",
  description: "Change the description or purpose of a channel. [See docs here](https://api.slack.com/methods/conversations.setPurpose)",
  version: "0.0.1",
  type: "action",
  props: {
    slack,
    conversation: {
      propDefinition: [
        slack,
        "conversation",
      ],
    },
    purpose: {
      propDefinition: [
        slack,
        "purpose",
      ],
    },
  },
  async run() {
    return await this.slack.sdk().conversations.setPurpose({
      channel: this.conversation,
      purpose: this.purpose,
    });
  },
};
