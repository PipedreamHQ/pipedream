import utils from "../../common/utils.mjs";
import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-reply-to-conversation",
  name: "Reply To Conversation",
  description: "Reply to a conversation by sending a message and appending it to the conversation. [See the documentation](https://dev.frontapp.com/reference/post_conversations-conversation-id-messages).",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    frontApp,
    conversationId: {
      propDefinition: [
        frontApp,
        "conversationId",
      ],
    },
    tagIds: {
      propDefinition: [
        frontApp,
        "tagIds",
      ],
      optional: true,
      description: "List of all the tag IDs replacing the old conversation tags",
    },
    authorId: {
      propDefinition: [
        frontApp,
        "teammateId",
      ],
      label: "Author ID",
      description: "ID of the teammate on behalf of whom the answer is sent",
    },
    senderName: {
      type: "string",
      label: "Sender Name",
      description: "Name used for the sender info of the message",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the message for email message",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "Body of the message",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Text version of the body for messages with non-text body",
      optional: true,
    },
    attachments: {
      propDefinition: [
        frontApp,
        "attachments",
      ],
    },
    quoteBody: {
      type: "string",
      label: "Quote Body",
      description: "Body for the quote that the message is referencing. Only available on email channels.",
      optional: true,
    },
    optionsTagIds: {
      propDefinition: [
        frontApp,
        "tagIds",
      ],
      optional: true,
      description: "List of tag names to add to the conversation (unknown tags will automatically be created)",
    },
    optionsIsArchive: {
      type: "boolean",
      label: "Is Archive",
      description: "Archive the conversation right when sending the message (Default: true)",
      optional: true,
    },
    to: {
      propDefinition: [
        frontApp,
        "to",
      ],
    },
    cc: {
      propDefinition: [
        frontApp,
        "cc",
      ],
    },
    bcc: {
      propDefinition: [
        frontApp,
        "bcc",
      ],
    },
  },
  async run({ $ }) {
    const {
      conversationId,
      authorId,
      senderName,
      subject,
      body,
      text,
      quoteBody,
      optionsIsArchive,
    } = this;

    const to = utils.parse(this.to);
    const cc = utils.parse(this.cc);
    const bcc = utils.parse(this.bcc);
    const tagIds = utils.parse(this.optionsTagIds);
    const attachments = utils.parse(this.attachments);

    const hasAttachments = utils.hasArrayItems(attachments);
    const hasCc = utils.hasArrayItems(cc);
    const hasBcc = utils.hasArrayItems(bcc);

    const data = utils.reduceProperties({
      initialProps: {
        to,
        body,
      },
      additionalProps: {
        cc: [
          cc,
          hasCc,
        ],
        bcc: [
          bcc,
          hasBcc,
        ],
        sender_name: senderName,
        subject,
        author_id: authorId,
        body,
        text,
        quote_body: quoteBody,
        options: {
          tag_ids: tagIds,
          archive: optionsIsArchive ?? true,
        },
        attachments: [
          attachments,
          hasAttachments,
        ],
      },
    });

    const args = utils.reduceProperties({
      initialProps: {
        conversationId,
        data,
      },
      additionalProps: {
        headers: [
          {
            "Content-Type": "multipart/form-data",
          },
          hasAttachments,
        ],
      },
    });

    await this.frontApp.replyToConversation(args);

    $.export("$summary", `Successfully updated conversation with ID ${conversationId}`);

    return conversationId;
  },
};
