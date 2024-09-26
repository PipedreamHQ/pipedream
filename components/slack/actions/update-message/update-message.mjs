import slack from "../../slack.app.mjs";

export default {
  key: "slack-update-message",
  name: "Update Message",
  description: "Update a message. [See the documentation](https://api.slack.com/methods/chat.update)",
  version: "0.1.19",
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
    text: {
      propDefinition: [
        slack,
        "text",
      ],
    },
    as_user: {
      propDefinition: [
        slack,
        "as_user",
      ],
      description: "Pass true to update the message as the authed user. Bot users in this context are considered authed users.",
    },
    attachments: {
      propDefinition: [
        slack,
        "attachments",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.slack.sdk().chat.update({
      ts: this.timestamp,
      text: this.text,
      channel: this.conversation,
      as_user: this.as_user,
      attachments: this.attachments,
    });
    $.export("$summary", "Successfully updated message");
    return response;
  },
};
