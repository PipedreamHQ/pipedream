import dixa from "../../dixa.app.mjs";

export default {
  key: "dixa-tag-conversation",
  name: "Add Tag to Conversation",
  description: "Adds a tag to a conversation. [See the documentation](https://docs.dixa.io/openapi/dixa-api/v1/tag/Tags/#tag/Tags/operation/putConversationsConversationidTagsTagid)",
  version: "0.0.3",
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
    tagId: {
      propDefinition: [
        dixa,
        "tagId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dixa.addTag({
      $,
      conversationId: this.conversationId,
      tagId: this.tagId,
    });
    $.export("$summary", `Added tag ${this.tagId} to conversation ${this.conversationId}`);
    return response;
  },
};
