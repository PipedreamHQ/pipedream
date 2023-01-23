import common from "../common.mjs";

export default {
  ...common,
  key: "intercom-new-admin-reply",
  name: "New Reply From Admin",
  description: "Emit new event each time an admin replies to a conversation.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(conversation, conversationData, conversationBody, totalCount) {
      return {
        id: conversationData.conversation_parts.conversation_parts[totalCount - 1].id,
        summary: conversationBody,
        ts: conversation.statistics.last_admin_reply_at,
      };
    },
  },
  async run() {
    let lastAdminReplyAt = this._getLastUpdate();
    const data = {
      query: {
        field: "statistics.last_admin_reply_at",
        operator: ">",
        value: lastAdminReplyAt,
      },
    };

    const results = await this.intercom.searchConversations(data);
    for (const conversation of results) {
      if (conversation.statistics.last_admin_reply_at > lastAdminReplyAt)
        lastAdminReplyAt = conversation.statistics.last_admin_reply_at;
      const conversationData = (
        await this.intercom.getConversation(conversation.id)
      );
      const totalCount = conversationData.conversation_parts.total_count;
      const conversationBody =
        conversationData?.conversation_parts?.conversation_parts[totalCount - 1]?.body;
      if (totalCount > 0 && conversationBody) {
        // emit id & summary from last part/reply added
        const meta =
          this.generateMeta(conversation, conversationData, conversationBody, totalCount);
        this.$emit(conversationData, meta);
      }
    }

    this._setLastUpdate(lastAdminReplyAt);
  },
};
