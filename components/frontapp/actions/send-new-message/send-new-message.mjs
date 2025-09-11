import utils from "../../common/utils.mjs";
import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-send-new-message",
  name: "Send New Message",
  description: "Sends a new message from a channel. It will create a new conversation. [See the documentation](https://dev.frontapp.com/reference/post_channels-channel-id-messages).",
  version: "0.2.8",
  type: "action",
  props: {
    frontApp,
    channelId: {
      propDefinition: [
        frontApp,
        "channelId",
      ],
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
      description: "Body of the message. Accepts HTML",
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
      channelId,
      authorId,
      senderName,
      subject,
      body,
      text,
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
        channelId,
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

    const response = await this.frontApp.sendMessage(args);

    $.export("$summary", `Successfully sent new message to channel with ID ${response.id}`);

    return response;
  },
};
