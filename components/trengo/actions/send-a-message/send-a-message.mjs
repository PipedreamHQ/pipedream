import app from "../../trengo.app.mjs";

export default {
  type: "action",
  key: "trengo-send-a-message",
  version: "0.0.3",
  name: "Send A Message",
  description: "This action can be used to easily send a message or an email without having to think about contacts or tickets, [See the docs](https://developers.trengo.com/reference/send-a-message-1)",
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
    createInternalNote: {
      type: "boolean",
      label: "Create Internal Note",
      description: "Create an internal note instead of sending a message to the contact",
      optional: true,
      default: false,
    },
  },
  async run ({ $ }) {
    if (this.createInternalNote) {
      // Create internal note instead of sending message
      const resp = await this.app.createInternalNote({
        $,
        data: {
          note: this.message,
          // Internal notes might need additional context
          metadata: {
            channel_id: this.channelId,
            contact_identifier: this.contactIdentifier,
            contact_name: this.contactName,
          },
        },
      });
      $.export("$summary", "Internal note has been created");
      return resp;
    } else {
      // Send regular message
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
    }
  },
};
