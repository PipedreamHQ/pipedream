import {
  SORT_OPTIONS,
  SOURCE_TYPES,
} from "../../common/constants.mjs";
import common from "../common/polling.mjs";

export default {
  ...common,
  key: "trustpilot-updated-conversations",
  name: "New Updated Conversations",
  description: "Emit new event when an existing conversation is updated with new messages on Trustpilot. This source periodically polls the Trustpilot API to detect conversations that have received new messages. Each event contains updated conversation details including participants, subject, message count, and latest update timestamp. Useful for tracking ongoing customer interactions, ensuring timely responses to follow-up messages, and maintaining conversation continuity.",
  version: "0.0.4",
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
    getPollingParams() {
      return {
        businessUnitId: this.businessUnitId,
        limit: 100,
        sortBy: SORT_OPTIONS.UPDATED_AT_DESC,
        offset: 0,
      };
    },
    generateSummary(item) {
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
