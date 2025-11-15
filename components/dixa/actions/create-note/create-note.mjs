import dixa from "../../dixa.app.mjs";

export default {
  key: "dixa-create-note",
  name: "Create Note",
  description: "Creates an internal note for a conversation. [See the documentation](https://docs.dixa.io/openapi/dixa-api/v1/tag/Conversations/#tag/Conversations/operation/postConversationsConversationidNotes).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dixa,
    endUserId: {
      propDefinition: [
        dixa,
        "endUserId",
      ],
    },
    conversationId: {
      propDefinition: [
        dixa,
        "conversationId",
        ({ endUserId }) => ({
          endUserId,
        }),
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to create the note for.",
    },
  },
  async run({ $ }) {
    const response = await this.dixa.createNote({
      $,
      conversationId: this.conversationId,
      data: {
        message: this.message,
      },
    });
    $.export("$summary", `Successfully created note with ID ${response.data.id}`);
    return response;
  },
};
