import common from "../common/polling.mjs";
import { SOURCE_TYPES, SORT_OPTIONS } from "../../common/constants.mjs";

export default {
  ...common,
  key: "trustpilot-updated-conversations",
  name: "Updated Conversations",
  description: "Emit new events when conversations are updated (new messages added). Polls every 15 minutes.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSourceType() {
      return SOURCE_TYPES.UPDATED_CONVERSATIONS;
    },
    getPollingMethod() {
      return "getConversations";
    },
    getPollingParams(since) {
      return {
        businessUnitId: this.businessUnitId,
        limit: 100,
        sortBy: SORT_OPTIONS.UPDATED_AT_DESC,
        offset: 0,
      };
    },
    generateSummary(item, sourceType) {
      const participantName = item.participants?.[0]?.displayName || 
                             item.consumer?.displayName || 
                             "Anonymous";
      const subject = item.subject || item.title || "Conversation";
      const businessUnit = item.businessUnit?.displayName || this.businessUnitId || "Unknown";
      const messageCount = item.messageCount || item.messages?.length || "Unknown";
      
      return `Conversation "${subject}" updated by ${participantName} (${messageCount} messages) - ${businessUnit}`;
    },
  },
};