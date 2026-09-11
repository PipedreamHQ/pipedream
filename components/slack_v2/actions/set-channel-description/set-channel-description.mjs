import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-set-channel-description",
  name: "Set Channel Description",
  description: "Change the description or purpose of a channel. [See the documentation](https://api.slack.com/methods/conversations.setPurpose)",
  version: "0.0.21",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
    // conversations.setPurpose only accepts a channel ID — resolve a name the same way
    // every other AI-optimized tool in this app does.
    const channel = await this.slack.resolveChannelId(this.conversation);
    const response = await this.slack.setChannelDescription({
      channel,
      purpose: this.purpose,
    });
    $.export("$summary", `Successfully set description for channel with ID ${channel}`);
    return response;
  },
};
