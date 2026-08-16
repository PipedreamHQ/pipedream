import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-send-message",
  name: "Send Message",
  description: "Send a WhatsApp, Instagram DM, or Messenger message to a contact. Use a free-form body within a 24-hour customer window, or pick a pre-approved template for outbound outreach. [See the docs](https://www.instantreply.co/developers)",
  version: "0.1.0",
  type: "action",
  props: {
    instantReply,
    contactId: {
      propDefinition: [
        instantReply,
        "contactId",
      ],
    },
    channel: {
      propDefinition: [
        instantReply,
        "channel",
      ],
    },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "Send a free-form text message (only valid within 24 hours of the customer's last message) or a pre-approved template.",
      options: [
        { label: "Free-form text", value: "text" },
        { label: "Template", value: "template" },
      ],
      reloadProps: true,
    },
    body: {
      type: "string",
      label: "Message Body",
      description: "The text content of the message.",
      hidden: true,
    },
    templateId: {
      propDefinition: [
        instantReply,
        "templateId",
      ],
      hidden: true,
    },
    templateVariables: {
      type: "object",
      label: "Template Variables",
      description: "Key-value pairs for the template placeholders, e.g. `{ \"1\": \"Alice\", \"2\": \"order #123\" }`.",
      optional: true,
      hidden: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.messageType === "text") {
      props.body = {
        type: "string",
        label: "Message Body",
        description: "The text to send.",
      };
    }
    if (this.messageType === "template") {
      props.templateId = {
        propDefinition: [
          instantReply,
          "templateId",
        ],
      };
      props.templateVariables = {
        type: "object",
        label: "Template Variables",
        description: "Key-value pairs for template placeholders.",
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.instantReply.sendMessage({
      $,
      contactId: this.contactId,
      channel: this.channel,
      body: this.body,
      templateId: this.templateId,
      templateVariables: this.templateVariables,
    });
    $.export("$summary", `Message sent to contact ${this.contactId} via ${this.channel}`);
    return response;
  },
};
