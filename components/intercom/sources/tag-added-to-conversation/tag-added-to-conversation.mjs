import common from "../common/common.mjs";

export default {
  ...common,
  key: "intercom-tag-added-to-conversation",
  name: "Tag Added To Conversation",
  description: "Emit new event each time a new tag is added to a conversation.",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  methods: {
    generateMeta(conversation, tag) {
      const {
        id,
        name,
        applied_at: appliedAt,
      } = tag;
      return {
        id: `${conversation.id}${id}`,
        summary: name,
        ts: appliedAt,
      };
    },
  },
  async run() {
    const data = {
      query: {
        field: "tag_ids",
        operator: "!=",
        value: null,
      },
    };

    const results = await this.intercom.searchConversations(data);
    for (const conversation of results) {
      if (!conversation?.tags) {
        continue;
      }
      for (const tag of conversation.tags.tags) {
        const meta = this.generateMeta(conversation, tag);
        this.$emit({
          conversation,
          ...tag,
        }, meta);
      }
    }
  },
};
