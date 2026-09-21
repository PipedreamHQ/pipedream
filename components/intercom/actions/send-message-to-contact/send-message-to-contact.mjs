import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-send-message-to-contact",
  name: "Send Message To Contact",
  description: "Sends an outbound message from an admin to a contact in Intercom (POST /messages). Set **Message Type** to `in_app` for an in-app message or `email` for an email — email messages require **Subject** and support **Template** (`plain` or `personal`). Use **List Admin ID Options** to find a valid **From ID** and **Search Contacts** to find a valid **To ID**. Example: set **Message Type** to `email`, **Subject** to `Welcome!`, **Template** to `personal`, **From ID** to `25`, **To Type** to `user`, and **To ID** to `536e564f316c83104c000020` to send a personal welcome email to that contact. [See the documentation](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/messages/createmessage).",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    intercom,
    messageType: {
      type: "string",
      label: "Message Type",
      description: "The kind of message being created.",
      options: [
        "in_app",
        "email",
      ],
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The title of the email.",
    },
    body: {
      description: "The content of the message. HTML and plaintext are supported.",
      propDefinition: [
        intercom,
        "body",
      ],
    },
    template: {
      type: "string",
      label: "Template",
      description: "The style of the outgoing message.",
      options: [
        "plain",
        "personal",
      ],
    },
    fromId: {
      type: "string",
      label: "From ID",
      description: "The sender of the message. The identifier for the admin which is given by Intercom. If not provided, the default sender will be used.",
      propDefinition: [
        intercom,
        "adminId",
      ],
    },
    toType: {
      type: "string",
      label: "To Type",
      description: "The type of the recipient of the message.",
      options: [
        "user",
        "lead",
      ],
    },
    toId: {
      type: "string",
      label: "To ID",
      description: "The recipient of the message. The identifier for the contact which is given by Intercom. Eg. `536e564f316c83104c000020`.",
      propDefinition: [
        intercom,
        "userIds",
      ],
    },
  },
  async run({ $ }) {
    const {
      messageType,
      subject,
      body,
      template,
      fromId,
      toType,
      toId,
    } = this;

    const response = await this.intercom.sendMessage({
      $,
      data: {
        message_type: messageType,
        subject,
        body,
        template,
        from: {
          type: "admin",
          id: fromId,
        },
        to: {
          type: toType,
          id: toId,
        },
      },
    });

    $.export("$summary", `Successfully sent message with ID \`${response.id}\`.`);
    return response;
  },
};
