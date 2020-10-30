const intercom = require("../../intercom.app.js");

module.exports = {
  key: "intercom-conversation-closed",
  name: "New Closed Conversation",
  description: "Emits an event each time a conversation is closed.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    intercom,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run(event) {
    const monthAgo = this.intercom.monthAgo();
    let lastConversationClosedAt =
      this.db.get("lastConversationClosedAt") || Math.floor(monthAgo / 1000);
    const data = {
      query: {
        field: "statistics.last_close_at",
        operator: ">",
        value: lastConversationClosedAt,
      },
    };

    const results = await this.intercom.searchConversations(data);
    for (const conversation of results) {
      if (conversation.created_at > lastConversationClosedAt)
        lastConversationClosedAt = conversation.statistics.last_close_at;
      this.$emit(conversation, {
        id: `${conversation.id}${conversation.last_close_at}`,
        summary: conversation.source.body,
        ts: conversation.last_close_at,
      });
    }

    this.db.set("lastConversationClosedAt", lastConversationClosedAt);
  },
};