import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-invite-user-to-channel",
  name: "Invite User to Channel",
  description: "Invite one or more users to an existing channel. Accepts a channel ID or NAME, and a user ID, EMAIL address or display name — all resolved automatically. Pass several users as a comma-separated list. [See the documentation](https://api.slack.com/methods/conversations.invite)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
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
    user: {
      propDefinition: [
        slack,
        "user",
      ],
    },
  },
  async run({ $ }) {
    // Agents pass whatever identifier the user said — an email in "invite
    // dylan@pipedream.com", a "#channel-name" lifted from the prompt. The raw API answers
    // user_not_found / channel_not_found, which reads as a broken tool rather than a
    // wrong-shaped argument. Every AI-optimized tool in this app resolves names already.
    //
    // resolveUserIds (plural) so the comma-separated list Slack has always accepted here
    // keeps working — each token is resolved independently.
    const channel = await this.slack.resolveChannelId(this.conversation);
    const user = await this.slack.resolveUserIds(this.user);
    const userIds = user.split(",");

    if (userIds.length === 1) {
      try {
        const response = await this.slack.inviteToConversation({
          channel,
          users: user,
        });
        $.export("$summary", `Successfully invited user ${this.user} to channel with ID ${channel}`);
        return response;
      } catch (error) {
        if (`${error}`.includes("already_in_channel")) {
          $.export("$summary", `The user ${this.user} is already in the channel`);
          return;
        }
        throw error;
      }
    }

    // already_in_channel can only be safely swallowed for a single-user request. For
    // multiple users, one bad token turning the whole request into "success" would hide
    // that the others were never invited, so each user is invited individually and
    // reported on its own.
    const results = [];
    for (const userId of userIds) {
      try {
        await this.slack.inviteToConversation({
          channel,
          users: userId,
        });
        results.push({
          user: userId,
          status: "invited",
        });
      } catch (error) {
        results.push({
          user: userId,
          status: `${error}`.includes("already_in_channel")
            ? "already_in_channel"
            : "error",
          error: `${error}`,
        });
      }
    }

    const invited = results.filter(({ status }) => status === "invited").length;
    const failed = results.filter(({ status }) => status === "error").length;
    const failedSuffix = failed
      ? ` (${failed} failed)`
      : "";
    $.export("$summary", `Invited ${invited} of ${userIds.length} user(s) to channel with ID ${channel}${failedSuffix}`);
    return results;
  },
};
