import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-get-conversation",
  name: "Get Conversation",
  description: "Get the conversation metadata (meeting name, member(s) name, member(s) email, start and end time, meeting type and meeting Id). See the doc [here](https://docs.symbl.ai/docs/conversation-api/conversation-data/)",
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
    const {
      id,
      type,
      name,
      startTime,
      endTime,
      members,
      metadata,
    } = await this.symblAIApp.getConversation({
      $,
      conversationId: this.conversationId,
    });
    $.export("$summary", `Successfully retrieved conversation ${id} metadata`);
    return {
      id,
      type,
      name,
      startTime,
      endTime,
      members,
      metadata,
    };
  },
};
