import belco from "../../belco.app.mjs";

export default {
  key: "belco-retrieve-conversation",
  name: "Retrieve Conversation",
  description: "Retrieve a conversation specified by ID. [See the documentation](https://developers.belco.io/reference/get_conversations-conversationid)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const response = await this.belco.getConversation({
      $,
      conversationId: this.conversationId,
    });

    $.export("$summary", `Retrieved conversation successfully: ${this.conversationId}`);
    return response;
  },
};
