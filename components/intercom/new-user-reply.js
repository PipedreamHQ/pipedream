const intercom = require("https://github.com/PipedreamHQ/pipedream/components/intercom/intercom.app.js");

module.exports = {
  name: "New Reply From User",
  description: "Emits an event each time a user replies to a conversation.",
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
    let lastContactReplyAt =
      this.db.get("lastContactReplyAt") || Math.floor(monthAgo / 1000);
    lastContactReplyAt = Math.floor(monthAgo / 1000);
    const data = {
      query: {
        field: "statistics.last_contact_reply_at",
        operator: ">",
        value: lastContactReplyAt,
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
        if (conversation.statistics.last_contact_reply_at > lastContactReplyAt)
          lastAdminReplyAt = conversation.statistics.last_admin_reply_at;
        let conversationData = (
          await this.intercom.getConversation(conversation.id)
        ).data;
        let total_count = conversationData.conversation_parts.total_count;
        if (
          total_count > 0 &&
          conversationData.conversation_parts.conversation_parts[
            total_count - 1
          ].body != null
        ) {
          // emit id & summary from last part/reply added
          this.$emit(conversationData, {
            id:
              conversationData.conversation_parts.conversation_parts[
                total_count - 1
              ].id,
            summary:
              conversationData.conversation_parts.conversation_parts[
                total_count - 1
              ].body,
            ts: conversation.statistics.last_admin_reply_at,
          });
        }
      }
    }

    this.db.set("lastContactReplyAt", lastContactReplyAt);
  },
};