import utils from "../../common/utils.mjs";
import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-receive-custom-messages",
  name: "Receive Custom Messages",
  description: "Sends a new message from a channel. It will create a new conversation. [See the docs here](https://dev.frontapp.com/reference/post_channels-channel-id-messages).",
  version: "0.0.1",
  type: "action",
  props: {
    frontApp,
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "Id or address of the channel from which to send the message",
    },
    handle: {
      type: "string",
      label: "Handle",
      description: "Handle of the sender. It can be any string used to uniquely identify the sender",
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "ID of the contact in Front corresponding to the sender",
      optional: true,
    },
    senderName: {
      type: "string",
      label: "Sender Name",
      description: "Name of the sender",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the message",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "Body of the message",
    },
    bodyFormat: {
      propDefinition: [
        frontApp,
        "bodyFormat",
      ],
    },
    threadRef: {
      propDefinition: [
        frontApp,
        "threadRef",
      ],
    },
    headers: {
      type: "object",
      label: "Headers",
      description: "Custom object where any internal information can be stored",
      optional: true,
    },
    attachments: {
      propDefinition: [
        frontApp,
        "attachments",
      ],
    },
  },
  async run({ $ }) {
    const {
      channelId,
      handle,
      contactId,
      senderName,
      subject,
      body,
      bodyFormat,
      threadRef,
      headers,
    } = this;

    const attachments = utils.parse(this.attachments);

    const response = await this.frontApp.receiveCustomMessages({
      channelId,
      data: {
        sender: {
          contact_id: contactId,
          name: senderName,
          handle,
        },
        subject,
        body,
        body_format: bodyFormat,
        metadata: {
          thread_ref: threadRef,
          headers,
        },
        attachments,
      },
    });

    $.export("$summary", `Successfully received message with ID ${response.id}`);

    return response;
  },
};
