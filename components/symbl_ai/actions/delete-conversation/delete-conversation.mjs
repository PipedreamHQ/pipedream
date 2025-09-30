import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-delete-conversation",
  name: "Delete Conversation",
  description: "Permanently deletes the conversation and all related entities such as messages, insights, topics, etc. See the doc [here](https://docs.symbl.ai/docs/conversation-api/delete-conversation/).",
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
  },
  async run({ $ }) {
    const response =
      await this.symblAIApp.deleteConversation({
        $,
        conversationId: this.conversationId,
      });
    $.export("$summary", "Successfully deleted the conversation.");
    return response;
  },
};
