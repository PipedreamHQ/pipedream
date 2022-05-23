import utils from "../../common/utils.mjs";
import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-send-new-message",
  name: "Send New Message",
  description: "Sends a new message from a channel. It will create a new conversation. [See the docs here](https://dev.frontapp.com/reference/post_channels-channel-id-messages).",
  version: "0.2.2",
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
        "contactId",
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
    optionsTagIds: {
      propDefinition: [
        frontApp,
        "tagIds",
      ],
      description: "List of tag names to add to the conversation (unknown tags will automatically be created)",
    },
    optionsIsArchive: {
      type: "boolean",
      label: "Is Archive",
      description: "Archive the conversation right when sending the message (Default: true)",
      optional: true,
    },
    to: {
      type: "string[]",
      label: "To",
      description: "List of the recipient handles who will receive this message",
    },
    cc: {
      type: "string[]",
      label: "CC",
      description: "List of the recipient handles who will receive a copy of this message",
      optional: true,
    },
    bcc: {
      type: "string[]",
      label: "BCC",
      description: "List of the recipient handles who will receive a blind copy of this message",
      optional: true,
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

    const response = await this.frontApp.sendMessage({
      channelId,
      data: {
        to,
        cc,
        bcc,
        sender_name: senderName,
        subject,
        author_id: authorId,
        body,
        text,
        options: {
          tag_ids: tagIds,
          archive: optionsIsArchive,
        },
        attachments,
      },
    });

    $.export("$summary", `Successfully sent new message to channel with ID ${response.id}`);

    return response;
  },
};
