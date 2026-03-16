import app from "../../trengo.app.mjs";

export default {
  key: "trengo-get-email-message-content",
  name: "Get Email Message Content",
  description: "Retrieve the full email content for a specific ticket message. Use this when `email_message.collapsed` is true in the List Messages response. [See the documentation](https://developers.trengo.com/reference)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    ticketId: {
      propDefinition: [
        app,
        "ticketId",
      ],
    },
    messageId: {
      type: "integer",
      label: "Message ID (Comment ID)",
      description: "The ID of the email message. This is typically the `id` or `comment_id` field from the message object returned by the 'List Messages' action.",
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      path: `/tickets/${this.ticketId}/email_messages/${this.messageId}`,
    });

    $.export(
      "$summary",
      `Successfully retrieved full email content for message ID: ${this.messageId}`,
    );

    return response;
  },
};
