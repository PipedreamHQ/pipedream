import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-get-channel-details",
  name: "Get Channel Details",
  description: "Retrieve details for a Slack channel, specified by ID (preferred — resolves instantly) or by name (resolved by scanning the workspace's channel list, which can be slow). [See the documentation](https://api.slack.com/methods/conversations.info)",
  version: "0.1.6",
  type: "action",
  ai: "optimized",
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
      description: "Prefer a channel ID (e.g. `C1234567890`) — use **List Channels** to look it up; it resolves instantly. A channel name (e.g. `general` or `#general`) is also accepted, but resolving it scans the workspace's full channel list and can be slow (or fail) on large workspaces.",
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
