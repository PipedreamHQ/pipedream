import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-post-message",
  name: "Post Message",
  description:
    "Send a message to a channel, user, or group."
    + " Accepts a channel ID (e.g. `C1234567890`) or channel name (e.g. `#general` or `general`) — names are resolved automatically."
    + " To reply to a thread, provide `thread_ts` from **Get Channel History**."
    + " Supports plain text with Slack mrkdwn formatting and Block Kit blocks."
    + " [See the documentation](https://api.slack.com/methods/chat.postMessage)",
  version: "0.0.1",
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
      description: "Channel ID (e.g. `C1234567890`), channel name (e.g. `general` or `#general`), user ID, or group ID. Channel names are resolved to IDs automatically.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The message text. Supports Slack mrkdwn formatting (e.g. `*bold*`, `_italic_`, `<https://example.com|link>`).",
    },
    blocks: {
      type: "string",
      label: "Blocks",
      description: "JSON array of Block Kit blocks for rich message layouts.",
      optional: true,
    },
    threadTs: {
      type: "string",
      label: "Thread Timestamp",
      description: "The `ts` of a parent message to reply to. If provided, the message is posted as a threaded reply.",
      optional: true,
    },
    replyBroadcast: {
      type: "boolean",
      label: "Reply Broadcast",
      description: "When replying to a thread, set to `true` to also post the reply to the channel.",
      default: false,
      optional: true,
    },
    unfurlLinks: {
      type: "boolean",
      label: "Unfurl Links",
      description: "Enable unfurling of text-based content (URLs).",
      default: true,
      optional: true,
    },
    unfurlMedia: {
      type: "boolean",
      label: "Unfurl Media",
      description: "Enable unfurling of media content.",
      default: true,
      optional: true,
    },
    mrkdwn: {
      type: "boolean",
      label: "Parse Markdown",
      description: "Set to `false` to disable Slack mrkdwn parsing.",
      default: true,
      optional: true,
    },
  },
  async run({ $ }) {
    // chat.postMessage accepts channel names directly — no ID resolution needed
    const channel = this.slack.normalizeChannel(this.channel);
    const args = {
      channel,
      text: this.text,
      mrkdwn: this.mrkdwn,
      unfurl_links: this.unfurlLinks,
      unfurl_media: this.unfurlMedia,
    };
    if (this.blocks) {
      args.blocks = JSON.parse(this.blocks);
    }
    if (this.threadTs) {
      args.thread_ts = this.threadTs;
      args.reply_broadcast = this.replyBroadcast;
    }
    const response = await this.slack.postChatMessage(args);
    const permalink = await this.slack.makeRequest({
      method: "chat.getPermalink",
      channel: response.channel,
      message_ts: response.ts,
    });
    $.export("$summary", `Message sent to ${response.channel}${this.threadTs
      ? " (thread reply)"
      : ""}`);
    return {
      ...response,
      permalink: permalink?.permalink,
    };
  },
};
