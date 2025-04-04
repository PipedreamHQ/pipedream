import common from "../common/common.mjs";

export default {
  ...common,
  key: "intercom-new-conversation-rating-added",
  name: "New Conversation Rating Added",
  description: "Emit new event each time a new rating is added to a conversation.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(conversation) {
      const ts = conversation.conversation_rating.created_at;
      return {
        id: `${conversation.id}-${ts}`,
        summary: `New rating added to conversation with ID: ${conversation.id}`,
        ts,
      };
    },
  },
  async run() {
    let lastRatingCreatedAt = this._getLastUpdate();
    const data = {
      query: {
        field: "conversation_rating.requested_at",
        operator: ">",
        value: lastRatingCreatedAt,
      },
    };

    const results = await this.intercom.searchConversations(data);
    for (const conversation of results) {
      const createdAt = conversation.conversation_rating.created_at;
      if (createdAt > lastRatingCreatedAt)
        lastRatingCreatedAt = createdAt;
      const meta = this.generateMeta(conversation);
      this.$emit(conversation, meta);
    }

    this._setLastUpdate(lastRatingCreatedAt);
  },
};
