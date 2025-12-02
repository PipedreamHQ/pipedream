import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-send-message",
  name: "Send Message",
  description: "Sends a message to a thread. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-message/post-conversations-v3-conversations-threads-threadId-messages)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    hubspot,
    inboxId: {
      propDefinition: [
        hubspot,
        "inboxId",
      ],
    },
    senderActorId: {
      propDefinition: [
        hubspot,
        "senderActorId",
      ],
    },
    channelId: {
      propDefinition: [
        hubspot,
        "channelId",
      ],
    },
    threadId: {
      propDefinition: [
        hubspot,
        "threadId",
        (c) => ({
          inboxId: c.inboxId,
          channelId: c.channelId,
        }),
      ],
    },
    channelAccountId: {
      propDefinition: [
        hubspot,
        "channelAccountId",
        (c) => ({
          inboxId: c.inboxId,
          channelId: c.channelId,
        }),
      ],
    },
    recipientType: {
      type: "string",
      label: "Recipient Type",
      description: "The type of identifier. HS_EMAIL_ADDRESS for email addresses; HS_PHONE_NUMBER for a phone number; CHANNEL_SPECIFIC_OPAQUE_ID for channels that use their own proprietary identifiers, like Facebook Messenger or LiveChat. Use the \"List Messages\" action to locate a CHANNEL_SPECIFIC_OPAQUE_ID.",
      options: [
        "HS_EMAIL_ADDRESS",
        "HS_PHONE_NUMBER",
        "CHANNEL_SPECIFIC_OPAQUE_ID",
      ],
    },
    recipientValue: {
      type: "string",
      label: "Recipient Value",
      description: "The value of the recipient identifier. For HS_EMAIL_ADDRESS, this is the email address. For HS_PHONE_NUMBER, this is the phone number. For CHANNEL_SPECIFIC_OPAQUE_ID, this is the proprietary identifier.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text content of the message",
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
            recipientField: "TO",
            deliveryIdentifiers: [
              {
                type: this.recipientType,
                value: this.recipientValue,
              },
            ],
          },
        ],
        senderActorId: `A-${this.senderActorId}`,
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
