import utils from "../../common/utils.mjs";
import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-receive-custom-messages",
  name: "Receive Custom Messages",
  description: "Receive a custom message in Front. [See the docs here](https://dev.frontapp.com/reference/post_channels-channel-id-incoming-messages).",
  version: "0.0.37",
  type: "action",
  props: {
    frontApp,
    channelId: {
      propDefinition: [
        frontApp,
        "channelId",
        () => ({
          filter: (channel) => [
            "custom",
          ].includes(channel.type),
        }),
      ],
    },
    handle: {
      type: "string",
      label: "Handle",
      description: "Handle of the sender. It can be any string used to uniquely identify the sender",
    },
    contactId: {
      propDefinition: [
        frontApp,
        "contactId",
      ],
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
    bodyFormat: {
      propDefinition: [
        frontApp,
        "bodyFormat",
      ],
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "Body of the message",
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

    const sender = utils.emptyObjectToUndefined({
      contact_id: contactId,
      name: senderName,
      handle,
    });

    const metadata = utils.emptyObjectToUndefined({
      thread_ref: threadRef,
      headers,
    });

    const data = utils.reduceProperties({
      initialProps: {
        body,
        sender,
      },
      additionalProps: {
        body_format: bodyFormat,
        metadata,
        attachments,
        subject,
      },
    });

    const response = await this.frontApp.receiveCustomMessages({
      channelId,
      data,
    });

    $.export("$summary", `Successfully received message with ID ${response.message_uid}`);

    return response;
  },
};
