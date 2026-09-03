import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-archive-channel",
  name: "Archive Channel",
  description: "Archive a public or private channel. Direct messages and group DMs can't be archived — pass a channel ID (e.g. `C1234567890`), not a user or group ID. [See the documentation](https://api.slack.com/methods/conversations.archive)",
  version: "0.0.34",
  annotations: {
    destructiveHint: true,
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
    },
  },
  async run({ $ }) {
    const response = await this.slack.archiveConversations({
      channel: this.conversation,
    });
    $.export("$summary", "Successfully archived channel.");
    return response;
  },
};
