// x-pd-ai: optimized
import slack from "../../slack_v2.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "slack_v2-edit-message",
  name: "Edit Message",
  description:
    "Edit an existing message."
    + " Accepts a channel ID or channel name (resolved automatically)."
    + " Requires the message timestamp (`ts`) from **Get Channel History** or **Post Message**."
    + " You can only edit messages posted by the same token/user."
    + " [See the documentation](https://api.slack.com/methods/chat.update)",
  version: "0.0.4",
  type: "action",
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
      description: "Channel ID (e.g. `C1234567890`) or channel name (e.g. `general` or `#general`). Resolved automatically.",
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
    // Slack refuses chat.update unless the calling identity authored the message, and
    // post-message tries the bot identity first, falling back to the user identity when
    // the bot can't deliver — so the message being edited may have been posted as
    // either one. Try both here too, mirroring the fallback already used in
    // delete-message, rather than guessing which identity posted it.
    const attempt = (as_user) => this.slack.updateMessage({
      ...args,
      as_user,
    });
    const hasBotToken = Boolean(this.slack.getBotToken());

    let response;
    try {
      response = await attempt(false);
    } catch (error) {
      if (!hasBotToken || !`${error}`.includes("cant_update_message")) throw error;
      response = await attempt(true);
    }

    $.export("$summary", `Message updated in ${channelId}`);
    return response;
  },
};
