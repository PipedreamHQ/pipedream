import sunshineConversations from "../../sunshine_conversations.app.mjs";

export default {
  key: "sunshine_conversations-list-participants",
  name: "List Participants",
  description: "List participants of a conversation. [See the documentation](https://developer.zendesk.com/api-reference/conversations/#tag/Participants/operation/ListParticipants)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    sunshineConversations,
    userId: {
      propDefinition: [
        sunshineConversations,
        "userId",
      ],
    },
    conversationId: {
      propDefinition: [
        sunshineConversations,
        "conversationId",
        ({ userId }) => ({
          userId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = this.sunshineConversations.paginate({
      fn: this.sunshineConversations.listParticipants,
      $,
      conversationId: this.conversationId,
      resourceKey: "participants",
    });

    const participants = [];
    for await (const participant of response) {
      participants.push(participant);
    }

    $.export("$summary", `Successfully listed ${participants.length} participant(s) of conversation with ID ${this.conversationId}`);
    return participants;
  },
};
