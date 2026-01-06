import app from "../../trengo.app.mjs";

export default {
  type: "action",
  key: "trengo-send-a-message",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Send A Message",
  description: "This action can be used to easily send a message or an email without having to think about contacts or tickets, [See the documentation](https://developers.trengo.com/reference/send-a-message-1)",
  props: {
    app,
    channelId: {
      propDefinition: [
        app,
        "channelId",
      ],
    },
    contactIdentifier: {
      propDefinition: [
        app,
        "contactIdentifier",
      ],
      description: "The destination of the message. Based on the `Channel ID` this must be en email address or phone number.",
    },
    contactName: {
      propDefinition: [
        app,
        "contactName",
      ],
      description: "The name of the contact. Only used when the contact does not already exists.",
    },
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
    emailSubject: {
      propDefinition: [
        app,
        "emailSubject",
      ],
    },
  },
  async run ({ $ }) {
    const resp = await this.app.sendMessage({
      $,
      data: {
        channel_id: this.channelId,
        contact_identifier: this.contactIdentifier,
        contact_name: this.contactName,
        message: this.message,
        email_subject: this.emailSubject,
      },
    });
    $.export("$summary", "The message has been sent");
    return resp;
  },
};
