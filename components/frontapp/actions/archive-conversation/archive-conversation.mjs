import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-archive-conversation",
  name: "Archive Conversation",
  description: "Archives a conversation. [See the documentation](https://dev.frontapp.com/reference/patch_conversations-conversation-id)",
  version: "0.0.3",
  type: "action",
  props: {
    frontApp,
    conversationId: {
      propDefinition: [
        frontApp,
        "conversationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.frontApp.updateConversation({
      $,
      conversationId: this.conversationId,
      data: {
        status: "archived",
      },
    });
    $.export("$summary", `Successfully archived conversation with ID: ${this.conversationId}`);
    return response;
  },
};
