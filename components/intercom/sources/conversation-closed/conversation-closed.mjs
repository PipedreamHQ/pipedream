import common from "../common/common.mjs";

export default {
  ...common,
  key: "intercom-conversation-closed",
  name: "New Closed Conversation",
  description: "Emit new event each time a conversation is closed.",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta({
      id: conversationId, last_close_at: lastClosedAt, source,
    }) {
      return {
        id: `${conversationId}${lastClosedAt}`,
        summary: source.body,
        ts: lastClosedAt,
      };
    },
  },
  async run() {
    let lastConversationClosedAt = this._getLastUpdate();
    const data = {
      query: {
        field: "statistics.last_close_at",
        operator: ">",
        value: lastConversationClosedAt,
      },
    };

    const results = await this.intercom.searchConversations(data);
    for (const conversation of results) {
      if (conversation.created_at > lastConversationClosedAt) {
        lastConversationClosedAt = conversation.statistics.last_close_at;
      }
      const meta = this.generateMeta(conversation);
      this.$emit(conversation, meta);
    }

    this._setLastUpdate(lastConversationClosedAt);
  },
};
