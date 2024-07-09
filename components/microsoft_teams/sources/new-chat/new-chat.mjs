import base from "../common/base.mjs";

export default {
  ...base,
  key: "microsoft_teams-new-chat",
  name: "New Chat",
  description: "Emit new event when a new chat is created",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    async getResources(lastCreated) {
      return this.getNewPaginatedResources(
        this.microsoftTeams.listChats,
        {},
        lastCreated,
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
