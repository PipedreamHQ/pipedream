const intercom = require("https://github.com/PipedreamHQ/pipedream/components/intercom/intercom.app.js");

module.exports = {
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

    let results = null;
    let starting_after = null;

    while (
      !results ||
      (results.data.pages.next !== null &&
        results.data.pages.next !== undefined)
    ) {
      if (resulst) starting_after = results.data.pages.next.starting_after;
      results = await this.intercom.searchConversations(data, starting_after);
      for (const conversation of results.data.conversations) {
        for (const tag of conversation.tags.tags) {
          this.$emit(tag, {
            id: `${conversation.id}${tag.id}`,
            summary: tag.name,
            ts: tag.applied_at,
          });
        }
      }
    }
  },
};