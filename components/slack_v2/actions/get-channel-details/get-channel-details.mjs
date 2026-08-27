// x-pd-ai: optimized
import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-get-channel-details",
  name: "Get Channel Details",
  description: "Retrieve details for a Slack channel, specified by ID or by name — names are resolved automatically. [See the documentation](https://api.slack.com/methods/conversations.info)",
  version: "0.1.2",
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
    // Accept a channel NAME as well as an ID — agents routinely pass the "#name" they read
    // in the prompt, and conversations.info answers that with channel_not_found.
    const channelId = await this.slack.resolveChannelId(this.channel);
    const response = await this.slack.conversationsInfo({
      channel: channelId,
      include_locale: this.includeLocale,
      include_num_members: this.includeNumberOfMembers,
    });

    const channelName = response.channel?.name || response.channel?.id || this.channel;
    $.export("$summary", `Fetched details for channel ${channelName}`);

    return response;
  },
};
