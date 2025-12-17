import belco from "../../belco.app.mjs";

export default {
  key: "belco-reopen-conversation",
  name: "Reopen Conversation",
  description: "Reopen a conversation specified by ID. [See the documentation](https://developers.belco.io/reference/put_conversations-conversationid-open)",
  version: "0.0.3",
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
        () => ({
          includeStatus: [
            "closed",
          ],
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.belco.reopenConversation({
      $,
      conversationId: this.conversationId,
    });

    $.export("$summary", `Reopened conversation successfully: ${this.conversationId}`);
    return response;
  },
};
