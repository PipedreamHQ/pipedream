import base from "../common/base.mjs";

export default {
  ...base,
  key: "helpcrunch-new-chat",
  name: "New Chat",
  description: "Emit new event when a new chat is created. [See the documentation](https://docs.helpcrunch.com/en/rest-api-v1/search-chats-v1)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getResourceFn() {
      return this.helpcrunch.searchChats;
    },
    getKey() {
      return "createdAt";
    },
    generateMeta(chat) {
      return {
        id: chat.id,
        summary: `New Chat with ID ${chat.id}`,
        ts: chat.createdAt,
      };
    },
  },
};
