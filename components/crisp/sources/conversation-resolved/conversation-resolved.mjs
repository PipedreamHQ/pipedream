import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "crisp-conversation-resolved",
  name: "Conversation Resolved",
  description: "Emit new event when a conversation is resolved",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.crisp.listConversations;
    },
    getArgs() {
      return {
        params: {
          filter_resolved: 1,
          per_page: 50,
        },
      };
    },
    getTsField() {
      return "updated_at";
    },
    filterByTimestamp() {
      return false;
    },
    generateMeta(item) {
      return {
        id: item.session_id,
        summary: `Conversation Resolved: ${item.session_id}`,
        ts: item[this.getTsField()],
      };
    },
  },
};
