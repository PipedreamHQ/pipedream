import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-send-message-to-contact",
  name: "Send Message To Contact",
  description: "Send a message to a contact in Intercom. [See the documentation](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/messages/createmessage).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
  methods: {
    sendMessage(args = {}) {
      return this.intercom.makeRequest({
        method: "POST",
        endpoint: "messages",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      sendMessage,
      messageType,
      subject,
      body,
      template,
      fromId,
      toType,
      toId,
    } = this;

    const response = await sendMessage({
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
