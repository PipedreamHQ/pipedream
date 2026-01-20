import common from "../common/common.mjs";

export default {
  ...common,
  key: "intercom-new-user-reply",
  name: "New Reply From User",
  description: "Emit new event each time a user replies to a conversation.",
  version: "0.0.8",
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
    let lastContactReplyAt = this._getLastUpdate();
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
        lastContactReplyAt = conversation.statistics.last_contact_reply_at;
      const conversationData = (
        await this.intercom.getConversation({
          conversationId: conversation.id,
        })
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

    this._setLastUpdate(lastContactReplyAt);
  },
};
