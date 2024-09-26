import base from "../common/base.mjs";

export default {
  ...base,
  key: "helpcrunch-chat-status-updated",
  name: "Chat Status Updated",
  description: "Emit new event when the status of a chat is updated. [See the documentation](https://docs.helpcrunch.com/en/rest-api-v1/search-chats-v1)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    async deploy() {
      const resourceFn = this.getResourceFn();
      const chats = await this.getResources(resourceFn);
      const previousStatuses = {};
      for (const chat of chats) {
        previousStatuses[chat.id] = chat.status;
      }
      this._setLast(previousStatuses);
    },
  },
  methods: {
    ...base.methods,
    getResourceFn() {
      return this.helpcrunch.searchChats;
    },
    generateMeta(chat) {
      const ts = Date.now();
      return {
        id: `${chat.id}${ts}`,
        summary: `Status Updated for Chat with ID ${chat.id}`,
        ts,
      };
    },
  },
  async run() {
    const previousStatuses = this._getLast();
    const currentStatuses = {};
    const resourceFn = this.getResourceFn();
    const chats = await this.getResources(resourceFn);
    for (const chat of chats) {
      currentStatuses[chat.id] = chat.status;
      if (previousStatuses[chat.id] !== chat.status) {
        const meta = this.generateMeta(chat);
        this.$emit(chat, meta);
      }
    }
    this._setLast(currentStatuses);
  },
};
