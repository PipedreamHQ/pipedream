import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-send-message",
  name: "Send Message",
  description: "Sends a message to a thread. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-message/post-conversations-v3-conversations-threads-threadId-messages)",
  //version: "0.0.1",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hubspot,
    threadId: {
      propDefinition: [
        hubspot,
        "threadId",
      ],
    },
    senderActorId: {
      type: "string",
      label: "Sender Actor ID",
      description: "The ID of the sender actor",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text content of the message",
    },
    recipientEmails: {
      type: "string[]",
      label: "Recipient Emails",
      description: "The email addresses of the recipients",
    },
    channelId: {
      propDefinition: [
        hubspot,
        "channelId",
      ],
    },
    channelAccountId: {
      propDefinition: [
        hubspot,
        "channelAccountId",
        (c) => ({
          channelId: c.channelId,
        }),
      ],
    },
    fileId: {
      propDefinition: [
        hubspot,
        "fileId",
      ],
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the message",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.createMessage({
      $,
      threadId: this.threadId,
      data: {
        type: "MESSAGE",
        text: this.text,
        recipients: [
          {
            deliveryIdentifiers: this.recipientEmails.map((email) => ({
              type: "HS_EMAIL_ADDRESS",
              value: email,
            })),
          },
        ],
        senderActorId: this.senderActorId,
        channelId: this.channelId,
        channelAccountId: this.channelAccountId,
        subject: this.subject,
        attachments: this.fileId
          ? [
            {
              fileId: this.fileId,
              type: "FILE",
            },
          ]
          : undefined,
      },
    });
    $.export("$summary", `Message successfully sent to thread ${this.threadId}`);
    return response;
  },
};
