import slack from "../../slack.app.mjs";

export default {
  key: "slack-set-channel-description",
  name: "Set Channel Description",
  description: "Change the description or purpose of a channel. [See the documentation](https://api.slack.com/methods/conversations.setPurpose)",
  version: "0.0.3",
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
  async run({ $ }) {
    const response = await this.slack.sdk().conversations.setPurpose({
      channel: this.conversation,
      purpose: this.purpose,
    });
    $.export("$summary", `Successfully set description for channel with ID ${this.conversation}`);
    return response;
  },
};
