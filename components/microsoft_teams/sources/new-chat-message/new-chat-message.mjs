import base from "../common/base.mjs";

export default {
  ...base,
  key: "microsoft_teams-new-chat-message",
  name: "New Chat Message",
  description: "Emit new event when a new message is received in a chat. [See the documentation](https://learn.microsoft.com/en-us/graph/api/chat-list-messages?view=graph-rest-1.0&tabs=http)",
  version: "0.0.14",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    chat: {
      propDefinition: [
        base.props.microsoftTeams,
        "chat",
      ],
    },
  },
  methods: {
    ...base.methods,
    async getResources(lastCreated, tsField) {
      return this.getNewPaginatedResources(
        this.microsoftTeams.listChatMessages,
        {
          chatId: this.chat,
        },
        lastCreated,
        tsField,
        true, // Sorted by creation date
      );
    },
    generateMeta(message) {
      return {
        id: message.id,
        summary: `New Message ${message.id}`,
        ts: Date.parse(message.createdDateTime),
      };
    },
  },
};
