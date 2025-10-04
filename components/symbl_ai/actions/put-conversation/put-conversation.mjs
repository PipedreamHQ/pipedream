import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-put-conversation",
  name: "Update Conversation",
  description: "Update an existing Conversation object with metadata information. See the doc [here](https://docs.symbl.ai/docs/conversation-api/put-all-conversations/).",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    symblAIApp,
    conversationId: {
      propDefinition: [
        symblAIApp,
        "conversationId",
      ],
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Provide key/value pairs of the Conversation metadata information to be updated.",
    },
  },
  async run({ $ }) {
    const response =
      await this.symblAIApp.putConversation({
        conversationId: this.conversationId,
        data: {
          metadata: this.metadata,
        },
      });
    $.export("$summary", `Successfully updated Conversation Id: ${response.id}`);
    return response;
  },
};
