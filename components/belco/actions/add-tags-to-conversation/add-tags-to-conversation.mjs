import belco from "../../belco.app.mjs";

export default {
  key: "belco-add-tags-to-conversation",
  name: "Add Tags to Conversation",
  description: "Add tags to a conversation. [See the documentation](https://developers.belco.io/reference/add-tags-to-a-conversation)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    belco,
    conversationId: {
      propDefinition: [
        belco,
        "conversationId",
      ],
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags to add to the conversation",
    },
  },
  async run({ $ }) {
    const response = await this.belco.addTagsToConversation({
      $,
      conversationId: this.conversationId,
      data: {
        tags: this.tags,
      },
    });
    $.export("$summary", `Successfully added tags to conversation: ${this.conversationId}`);
    return response;
  },
};
