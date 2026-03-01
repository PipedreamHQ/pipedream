import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-get-channel-details",
  name: "Get Channel Details",
  description: "Retrieve details for a Slack channel by selecting it or providing an ID. [See the documentation](https://api.slack.com/methods/conversations.info)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slack,
    channel: {
      propDefinition: [
        slack,
        "conversation",
      ],
      description: "Select a channel or provide a channel ID.",
    },
    includeLocale: {
      type: "boolean",
      label: "Include Locale",
      description: "Set to `true` to receive the locale for this channel",
      default: false,
      optional: true,
    },
    includeNumberOfMembers: {
      type: "boolean",
      label: "Include Member Count",
      description: "Set to `true` to receive the number of members of this channel",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.slack.conversationsInfo({
      channel: this.channel,
      include_locale: this.includeLocale,
      include_num_members: this.includeNumberOfMembers,
    });

    const channelName = response.channel?.name || response.channel?.id || this.channel;
    $.export("$summary", `Fetched details for channel ${channelName}`);

    return response;
  },
};
