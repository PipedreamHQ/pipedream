import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "crisp-new-conversation-created",
  name: "New Conversation Created",
  description: "Emit new event when a new conversation is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.crisp.listConversations;
    },
    getArgs(lastTs) {
      return {
        params: {
          filter_date_start: lastTs,
          order_date_created: 1,
        },
      };
    },
    getTsField() {
      return "created_at";
    },
    generateMeta(item) {
      return {
        id: item.session_id,
        summary: `New Conversation with ID: ${item.session_id}`,
        ts: item[this.getTsField()],
      };
    },
  },
};
