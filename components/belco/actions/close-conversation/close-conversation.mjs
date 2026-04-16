import belco from "../../belco.app.mjs";

export default {
  key: "belco-close-conversation",
  name: "Close Conversation",
  description: "Close a conversation specified by ID. [See the documentation](https://developers.belco.io/reference/put_conversations-conversationid-close)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
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
          excludeStatus: [
            "closed",
          ],
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.belco.closeConversation({
      $,
      conversationId: this.conversationId,
    });

    $.export("$summary", `Closed conversation successfully: ${this.conversationId}`);
    return response;
  },
};
