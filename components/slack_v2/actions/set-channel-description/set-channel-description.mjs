import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-set-channel-description",
  name: "Set Channel Description",
  description: "Change the description or purpose of a channel. [See the documentation](https://api.slack.com/methods/conversations.setPurpose)",
  version: "0.0.11",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const response = await this.slack.setChannelDescription({
      channel: this.conversation,
      purpose: this.purpose,
    });
    $.export("$summary", `Successfully set description for channel with ID ${this.conversation}`);
    return response;
  },
};
