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

    let response;
    try {
      response = await attempt(this.as_user);
    } catch (error) {
      if (!`${error}`.includes("cant_delete_message")) throw error;
      response = await attempt(!this.as_user);
    }

    $.export("$summary", "Successfully deleted message.");
    return response;
  },
};
