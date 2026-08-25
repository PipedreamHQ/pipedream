import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-archive-channel",
  name: "Archive Channel",
  description: "Archive a channel. [See the documentation](https://api.slack.com/methods/conversations.archive)",
  version: "0.0.32",
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
  },
  async run({ $ }) {
    const response = await this.slack.archiveConversations({
      channel: this.conversation,
    });
    $.export("$summary", "Successfully archived channel.");
    return response;
  },
};
