import slack from "../../slack.app.mjs";

export default {
  key: "slack-set-channel-purpose",
  name: "Set Channel Purpose",
  description: "Change the purpose of a channel",
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
