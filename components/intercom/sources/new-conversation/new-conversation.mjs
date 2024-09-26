import common from "../common.mjs";

export default {
  ...common,
  key: "intercom-new-conversation",
  name: "New Conversations",
  description: "Emit new event each time a new conversation is added.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta({
      id, source, created_at: createdAt,
    }) {
      return {
        id,
        summary: source.body,
        ts: createdAt,
      };
    },
  },
  async run() {
    let lastConversationCreatedAt = this._getLastUpdate();
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
      const meta = this.generateMeta(conversation);
      this.$emit(conversation, meta);
    }

    this._setLastUpdate(lastConversationCreatedAt);
  },
};
