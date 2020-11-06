const intercom = require("../../intercom.app.js");
const get = require("lodash.get");

module.exports = {
  key: "intercom-new-user-reply",
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

    const results = await this.intercom.searchConversations(data);
    for (const conversation of results) {
      if (conversation.statistics.last_contact_reply_at > lastContactReplyAt)
        lastAdminReplyAt = conversation.statistics.last_admin_reply_at;
      const conversationData = (
        await this.intercom.getConversation(conversation.id)
      ).data;
      const total_count = conversationData.conversation_parts.total_count;
      const conversationBody = get(
        conversationData,
        `conversation_parts.conversation_parts[${total_count - 1}].body`
      );
      if (total_count > 0 && conversationBody) {
        // emit id & summary from last part/reply added
        this.$emit(conversationData, {
          id:
            conversationData.conversation_parts.conversation_parts[
              total_count - 1
            ].id,
          summary: conversationBody,
          ts: conversation.statistics.last_admin_reply_at,
        });
      }
    }

    this.db.set("lastContactReplyAt", lastContactReplyAt);
  },
};