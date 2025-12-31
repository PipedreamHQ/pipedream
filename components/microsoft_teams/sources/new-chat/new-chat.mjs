import base from "../common/base.mjs";

export default {
  ...base,
  key: "microsoft_teams-new-chat",
  name: "New Chat",
  description: "Emit new event when a new chat is created. [See the documentation](https://learn.microsoft.com/en-us/graph/api/chat-list?view=graph-rest-1.0&tabs=http)",
  version: "0.0.14",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    async getResources(lastCreated, tsField) {
      return this.getNewPaginatedResources(
        this.microsoftTeams.listChats,
        {},
        lastCreated,
        tsField,
      );
    },
    generateMeta(chat) {
      return {
        id: chat.id,
        summary: chat.topic ?? `Chat ID ${chat.id}`,
        ts: Date.parse(chat.createdDateTime),
      };
    },
  },
};
