import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "donedone-new-conversation-created",
  name: "New Conversation Created",
  description: "Emit new event when a new conversation is created. [See the documentation](https://app.swaggerhub.com/apis-docs/DoneDone/DoneDone-2-Public-API/1.0.0-oas3#/Conversations/get__account_id__conversations_search)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.donedone.listConversations;
    },
    getResourceKey() {
      return "listConversations";
    },
    getPaginationKey() {
      return "totalConversationCount";
    },
    getSummary(item) {
      return `New Conversation Created: ${item.title}`;
    },
  },
};
