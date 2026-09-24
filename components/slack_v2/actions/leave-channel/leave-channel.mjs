import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-leave-channel",
  name: "Leave Channel",
  description: "Remove the authenticated user from a public or private channel. Leaving a channel the user is not a member of is a no-op, reported as `not_in_channel: true`. To leave several channels (e.g. every channel matching a pattern), use **List Channels** with `memberOnly: true` to find them, then call this action once per channel ID. [See the documentation](https://docs.slack.dev/reference/methods/conversations.leave/)",
  version: "0.0.2",
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
      description: "Prefer a channel ID (e.g. `C1234567890`) - use **List Channels** to look it up; it resolves instantly. A channel name (e.g. `general` or `#general`) is also accepted, but resolving it scans up to 5 pages (~5,000 channels) of the workspace's channel list, which can be slow - and a valid channel beyond that bound will not be found. Direct messages and the workspace's general channel can't be left.",
    },
  },
  async run({ $ }) {
    // conversations.leave only accepts a channel ID - resolve a name the same way
    // every other AI-optimized tool in this app does.
    const channel = await this.slack.resolveChannelId(this.conversation);
    const response = await this.slack.leaveConversation({
      channel,
    });
    $.export("$summary", response.not_in_channel
      ? `The authenticated user is not a member of channel ${channel}`
      : `Successfully left channel ${channel}`);
    return response;
  },
};
