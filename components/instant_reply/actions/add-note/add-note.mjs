import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-add-note",
  name: "Add Note to Conversation",
  description: "Add an internal note to an Instant Reply conversation. Useful for logging external context (form submission data, payment status, CRM updates) alongside the conversation thread. [See the docs](https://www.instantreply.co/developers)",
  version: "0.1.0",
  type: "action",
  props: {
    instantReply,
    conversationId: {
      propDefinition: [
        instantReply,
        "conversationId",
      ],
    },
    text: {
      type: "string",
      label: "Note Text",
      description: "The internal note to attach. Only visible to your team — not sent to the customer.",
    },
  },
  async run({ $ }) {
    const response = await this.instantReply.addNote({
      $,
      conversationId: this.conversationId,
      text: this.text,
    });
    $.export("$summary", `Note added to conversation ${this.conversationId}`);
    return response;
  },
};
