import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-send-conversation-message",
  name: "Send Conversation Message",
  description: "Send a message to a HubSpot conversation thread. [See the documentation](https://developers.hubspot.com/docs/api/conversations/threads)",
  version: "0.0.1",
  type: "action",
  props: {
    hubspot,
    threadId: {
      propDefinition: [
        hubspot,
        "threadId",
      ],
    },
    text: {
      type: "string",
      label: "Message Text",
      description: "The plain text content of the message",
    },
    richText: {
      type: "string",
      label: "Rich Text",
      description: "The rich text/HTML content of the message",
      optional: true,
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "The direction of the message",
      options: [
        {
          label: "Outgoing",
          value: "OUTGOING",
        },
        {
          label: "Incoming",
          value: "INCOMING",
        },
      ],
      default: "OUTGOING",
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.sendConversationMessage({
      threadId: this.threadId,
      data: {
        text: this.text,
        richText: this.richText || this.text,
        direction: this.direction,
        type: "MESSAGE",
      },
      $,
    });

    $.export("$summary", `Successfully sent message to conversation thread ${this.threadId}`);
    return response;
  },
};