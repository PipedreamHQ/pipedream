import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack-delete-message",
  name: "Delete Message",
  description: "Delete a message. [See the documentation](https://api.slack.com/methods/chat.delete)",
  version: "0.1.0",
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
      description: "Pass true to update the message as the authed user. Bot users in this context are considered authed users.",
    },
  },
  async run({ $ }) {
    const response = await this.slack.deleteMessage({
      channel: this.conversation,
      ts: this.timestamp,
      as_user: this.as_user,
    });
    $.export("$summary", "Successfully deleted message.");
    return response;
  },
};
