const intercom = require("../../intercom.app.js");

module.exports = {
  key: "intercom-new-conversation",
  name: "New Conversations",
  description: "Emits an event each time a new conversation is added.",
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
    let lastConversationCreatedAt =
      this.db.get("lastConversationCreatedAt") || Math.floor(monthAgo / 1000);
    const data = {
      query: {
        field: "created_at",
        operator: ">",
        value: lastConversationCreatedAt,
      },
    };

    const results = await this.intercom.searchConversations(data);
    for (const conversation of results) {
      if (conversation.created_at > lastConversationCreatedAt)
        lastConversationCreatedAt = conversation.created_at;
      this.$emit(conversation, {
        id: conversation.id,
        summary: conversation.source.body,
        ts: conversation.created_at,
      });
    }

    this.db.set("lastConversationCreatedAt", lastConversationCreatedAt);
  },
};