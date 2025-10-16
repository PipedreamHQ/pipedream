import belco from "../../belco.app.mjs";

export default {
  key: "belco-add-note-to-conversation",
  name: "Add Note to Conversation",
  description: "Add a note to a conversation specified by ID. [See the documentation](https://developers.belco.io/reference/put_conversations-conversationid-addnote)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    belco,
    conversationId: {
      propDefinition: [
        belco,
        "conversationId",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "The note body",
    },
  },
  async run({ $ }) {
    const response = await this.belco.addNoteToConversation({
      $,
      conversationId: this.conversationId,
      data: {
        body: this.body,
      },
    });

    $.export("$summary", `Added note to conversation successfully: ${this.conversationId}`);
    return response;
  },
};
