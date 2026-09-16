import slack from "../../slack_v2.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "slack_v2-edit-message",
  name: "Edit Message",
  description:
    "Edit an existing message."
    + " Accepts a channel ID (preferred — resolves instantly) or channel name (resolved by"
    + " scanning the workspace's channel list, which can be slow)."
    + " Requires the message timestamp (`ts`) from **Get Channel History** or **Post Message**."
    + " You can only edit messages posted by the same token/user."
    + " [See the documentation](https://api.slack.com/methods/chat.update)",
  version: "0.0.9",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    slack,
    channel: {
      type: "string",
      label: "Channel",
      description: "Prefer a channel ID (e.g. `C1234567890`) — use **List Channels** to look it up; it resolves instantly. A channel name (e.g. `general` or `#general`) is also accepted, but resolving it scans up to 5 pages (~5,000 channels) of the workspace's channel list, which can be slow — and a valid channel beyond that bound will not be found.",
    },
    timestamp: {
      type: "string",
      label: "Message Timestamp",
      description: "The `ts` of the message to edit (e.g. `1234567890.123456`). Get this from **Post Message** response or **Get Channel History**.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The new message text. Supports Slack mrkdwn formatting.",
    },
    blocks: {
      type: "string",
      label: "Blocks",
      description: "JSON array of Block Kit blocks. Replaces existing blocks. Example: `[{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":\"*Updated* message\"}}]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    // chat.update requires a channel ID (unlike chat.postMessage which accepts names)
    const channelId = await this.slack.resolveChannelId(this.channel);
    const args = {
      channel: channelId,
      ts: this.timestamp,
      text: this.text,
    };
    if (this.blocks) {
      try {
        args.blocks = JSON.parse(this.blocks);
      } catch (error) {
        throw new ConfigurationError("Invalid JSON string: " + error.message);
      }
    }
    const response = await this.slack.updateMessage(args);
    $.export("$summary", `Message updated in ${channelId}`);
    return response;
  },
};
