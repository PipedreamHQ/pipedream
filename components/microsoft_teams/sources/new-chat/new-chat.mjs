import base from "../common/base.mjs";

export default {
  ...base,
  key: "microsoft_teams-new-chat",
  name: "New Chat",
  description: "Emit new event when a new chat is created",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    max: {
      propDefinition: [
        base.props.microsoftTeams,
        "max",
      ],
    },
  },
  methods: {
    ...base.methods,
    async getResources(lastCreated) {
      return this.getNewPaginatedResources(
        this.microsoftTeams.listChats,
        {},
        this.max,
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
