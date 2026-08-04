import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-delete-message",
  name: "Delete Message",
  description:
    "Permanently delete a message. **This cannot be undone — confirm the exact message with the"
    + " user before calling it.** Identify the message first with **Get Channel History** or"
    + " **Search** and quote its text back, rather than deleting by position ('the last one')."
    + " Slack only lets an identity delete its own messages, so this deletes as whichever"
    + " identity posted: it retries automatically with the other identity if the first attempt"
    + " returns `cant_delete_message`. [See the documentation](https://api.slack.com/methods/chat.delete)",
  version: "0.2.0",
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
    // Slack refuses `chat.delete` unless the calling identity authored the message, and
    // this app picks the token from `as_user`: false routes to the BOT token, true/unset
    // to the USER token. post-message sends no as_user, so it posts as the USER — meaning
    // the old default here (as_user: false → bot token) could not delete anything
    // post-message had just created. "Post it, then take it back" failed every single
    // time with cant_delete_message. Rather than flip the default (a behaviour change for
    // existing workflows), try the configured identity and fall back to the other one.
    const attempt = (as_user) => this.slack.deleteMessage({
      channel: this.conversation,
      ts: this.timestamp,
      as_user,
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
