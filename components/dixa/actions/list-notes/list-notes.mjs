import dixa from "../../dixa.app.mjs";

export default {
  key: "dixa-list-notes",
  name: "List Notes",
  description: "Lists internal notes from a conversation. [See the documentation](https://docs.dixa.io/openapi/dixa-api/v1/tag/Conversations/#tag/Conversations/operation/getConversationsConversationidNotes).",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    const response = await this.dixa.listNotes({
      $,
      conversationId: this.conversationId,
    });
    $.export("$summary", `Successfully retrieved ${response.data.length} note(s) from conversation ${this.conversationId}`);
    return response;
  },
};
