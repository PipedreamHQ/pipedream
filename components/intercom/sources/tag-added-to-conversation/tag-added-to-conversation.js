const intercom = require("../../intercom.app.js");

module.exports = {
  key: "intercom-tag-added-to-conversation",
  name: "Tag Added To Conversation",
  description: "Emits an event each time a new tag is added to a conversation.",
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
    const data = {
      query: {
        field: "tag_ids",
        operator: "!=",
        value: null,
      },
    };

    results = await this.intercom.searchConversations(data);
    for (const conversation of results) {
      for (const tag of conversation.tags.tags) {
        this.$emit(tag, {
          id: `${conversation.id}${tag.id}`,
          summary: tag.name,
          ts: tag.applied_at,
        });
      }
    }
  },
};