import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-tag-conversation",
  name: "Tag Conversation",
  description: "Add tags to a conversation. [See the documentation](https://dev.frontapp.com/reference/patch_conversations-conversation-id)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    frontApp,
    conversationId: {
      propDefinition: [
        frontApp,
        "conversationId",
      ],
    },
    tagIds: {
      propDefinition: [
        frontApp,
        "tagIds",
      ],
      description: "List of the tag IDs to add",
    },
  },
  async run({ $ }) {
    const {
      frontApp, conversationId, tagIds,
    } = this;

    const { tags } = await frontApp.getConversation({
      $,
      conversationId,
    });

    const existingTagIds = tags?.map(({ id }) => id);
    const merged = [
      ...new Set([
        ...existingTagIds,
        ...tagIds,
      ]),
    ];

    const response = await frontApp.updateConversation({
      $,
      conversationId,
      data: {
        tag_ids: merged,
      },
    });
    $.export("$summary", `Successfully added tags to conversation with ID: ${conversationId}`);
    return response;
  },
};
