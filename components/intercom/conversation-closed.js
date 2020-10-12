const intercom = require("https://github.com/PipedreamHQ/pipedream/components/intercom/intercom.app.js");

module.exports = {
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
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    let lastConversationClosedAt =
      this.db.get("lastConversationClosedAt") || Math.floor(monthAgo / 1000);
    const data = {
      query: {
        field: "statistics.last_close_at",
        operator: ">",
        value: lastConversationClosedAt,
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
        if (conversation.created_at > lastConversationClosedAt)
          lastConversationClosedAt = conversation.statistics.last_close_at;
        this.$emit(conversation, {
          id: `${conversation.id}${conversation.last_close_at}`,
          summary: conversation.source.body,
          ts: conversation.last_close_at,
        });
      }
    }

    this.db.set("lastConversationClosedAt", lastConversationClosedAt);
  },
};