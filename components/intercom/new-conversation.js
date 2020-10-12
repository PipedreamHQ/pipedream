const intercom = require("https://github.com/PipedreamHQ/pipedream/components/intercom/intercom.app.js");

module.exports = {
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
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    let lastConversationCreatedAt =
      this.db.get("lastConversationCreatedAt") || Math.floor(monthAgo / 1000);
    const data = {
      query: {
        field: "created_at",
        operator: ">",
        value: lastConversationCreatedAt,
      },
    };

    let results = null;
    let starting_after = null;

    while (
      !results ||
      (results.data.pages.next !== null &&
        results.data.pages.next !== undefined)
    ) {
      if (results) starting_after = results.data.pages.next.starting_after;
      results = await this.intercom.searchConversations(data, starting_after);
      for (const conversation of results.data.conversations) {
        if (conversation.created_at > lastConversationCreatedAt)
          lastConversationCreatedAt = conversation.created_at;
        this.$emit(conversation, {
          id: conversation.id,
          summary: conversation.source.body,
          ts: conversation.created_at,
        });
      }
    }

    this.db.set("lastConversationCreatedAt", lastConversationCreatedAt);
  },
};