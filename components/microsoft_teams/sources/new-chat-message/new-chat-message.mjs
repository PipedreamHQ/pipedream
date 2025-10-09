import base from "../common/base.mjs";

export default {
  ...base,
  key: "microsoft_teams-new-chat-message",
  name: "New Chat Message",
  description: "Emit new event when a new message is received in a chat",
  version: "0.0.11",
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
    async getResources(lastCreated) {
      return this.getNewPaginatedResources(
        this.microsoftTeams.listChatMessages,
        {
          chatId: this.chat,
        },
        lastCreated,
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
