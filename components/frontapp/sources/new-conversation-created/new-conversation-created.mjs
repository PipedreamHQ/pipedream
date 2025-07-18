import common from "../common/polling-ids.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "frontapp-new-conversation-created",
  name: "New Conversation Created",
  description: "Emit new event when a conversation is created. [See the documentation](https://dev.frontapp.com/reference/list-conversations)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(conversation) {
      return {
        id: conversation.id,
        summary: `New conversation created: ${conversation.subject}`,
        ts: conversation.created_at * 1000,
      };
    },
    getItemId(conversation) {
      return conversation.id;
    },
    async getItems() {
      const response = await this.frontapp.listConversations({
        params: {
          sort_by: "date",
          sort_order: "desc",
        },
      });

      return response._results || [];
    },
  },
  sampleEmit,
};
