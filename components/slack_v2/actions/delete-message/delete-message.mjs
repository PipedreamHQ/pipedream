// x-pd-ai: optimized
import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-delete-message",
  name: "Delete Message",
  description:
    "Permanently delete a message. **This cannot be undone.**"
    + " To delete a specific message (including the most recent one), first call **Get Channel History**"
    + " to retrieve messages — `messages[0]` is the most recent — then pass its `ts` here."
    + " Quote the message text back to the user to confirm before deleting."
    + " Accepts a channel ID or NAME for the conversation, resolved automatically. Slack only"
    + " lets an identity delete its own messages, so this deletes as whichever identity posted:"
    + " it retries automatically with the other identity if the first attempt returns"
    + " `cant_delete_message`. [See the documentation](https://api.slack.com/methods/chat.delete)",
  version: "0.2.2",
  annotations: {
    destructiveHint: true,
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
    timestamp: {
      propDefinition: [
        slack,
        "messageTs",
      ],
    },
    as_user: {
      propDefinition: [
        slack,
        "as_user",
      ],
      description: "Pass true to delete the message as the authed user. Bot users in this context are considered authed users. Leave unset — the action falls back to the other identity automatically when Slack refuses.",
    },
  },
  async run({ $ }) {
    // conversation accepts a channel name as well as an ID (like every other AI-optimized
    // action in this app) — resolve it once up front so both delete attempts below reuse
    // the same ID instead of re-resolving (or silently failing on a name) per attempt.
    const channel = await this.slack.resolveChannelId(this.conversation);

    // Slack refuses `chat.delete` unless the calling identity authored the message, and
    // this app picks the token from `as_user`: false routes to the BOT token, true/unset
    // to the USER token. post-message sends no as_user, so it posts as the USER — meaning
    // the old default here (as_user: false → bot token) could not delete anything
    // post-message had just created. "Post it, then take it back" failed every single
    // time with cant_delete_message. Rather than flip the default (a behaviour change for
    // existing workflows), try the configured identity and fall back to the other one.
    const attempt = (asUser) => this.slack.deleteMessage({
      channel,
      ts: this.timestamp,
      as_user: asUser,
    });

    // makeRequest() routes to the bot token on `as_user === false` and to the user token for
    // anything else, so the "other identity" is a flip between exactly those two values.
    // Deriving it with `!this.as_user` made the fallback a no-op whenever as_user arrived
    // nullish: undefined and true both route to the user token, so it retried as the same
    // identity that had just been refused. Attempt 1 still passes the configured value
    // verbatim, so a working call is byte-identical to before.
    const other = this.as_user === false;

    // The fallback only reaches a genuinely different identity when a bot token exists:
    // that's the only case where flipping as_user changes which token makeRequest() picks.
    // Without a bot token both attempts hit the same user token, so retrying just repeats
    // the same cant_delete_message failure.
    const hasBotToken = Boolean(this.slack.getBotToken());

    let response;
    try {
      response = await attempt(this.as_user);
    } catch (error) {
      if (!hasBotToken || !`${error}`.includes("cant_delete_message")) throw error;
      response = await attempt(other);
    }

    $.export("$summary", "Successfully deleted message.");
    return response;
  },
};
