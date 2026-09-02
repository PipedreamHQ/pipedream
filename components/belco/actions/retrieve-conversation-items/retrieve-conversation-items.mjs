import belco from "../../belco.app.mjs";

export default {
  key: "belco-retrieve-conversation-items",
  name: "Retrieve Conversation Items",
  description: "Retrieve the list of items belonging to a conversation, such as messages, notes, assignments, tags, calls and status changes."
    + " Use this instead of **Retrieve Conversation** when you need the conversation's full message and event history rather than its top-level metadata."
    + " Returns a flat array in a single response with no pagination; each item carries a `type` field identifying which kind of event it is."
    + " [See the documentation](https://developers.belco.io/reference/get_conversations-conversationid-items)",
  version: "0.0.1",
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
    const response = await this.belco.getConversationItems({
      $,
      conversationId: this.conversationId,
    });

    $.export("$summary", `Successfully retrieved ${response.length} conversation item${response.length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
