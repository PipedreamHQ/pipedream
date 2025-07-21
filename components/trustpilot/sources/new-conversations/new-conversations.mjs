import common from "../common/polling.mjs";
import {
  SOURCE_TYPES, SORT_OPTIONS,
} from "../../common/constants.mjs";

export default {
  ...common,
  key: "trustpilot-new-conversations",
  name: "New Conversations",
  description: "Emit new event when a new conversation is started on Trustpilot. This source periodically polls the Trustpilot API to detect new customer-business conversations. Each event contains conversation details including participants, subject, business unit, and creation timestamp. Useful for tracking customer inquiries, support requests, and maintaining real-time communication with customers.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSourceType() {
      return SOURCE_TYPES.NEW_CONVERSATIONS;
    },
    getPollingMethod() {
      return "getConversations";
    },
    getPollingParams() {
      return {
        businessUnitId: this.businessUnitId,
        limit: 100,
        sortBy: SORT_OPTIONS.CREATED_AT_DESC,
        offset: 0,
      };
    },
    generateSummary(item) {
      const participantName = item.participants?.[0]?.displayName ||
                             item.consumer?.displayName ||
                             "Anonymous";
      const subject = item.subject || item.title || "New conversation";
      const businessUnit = item.businessUnit?.displayName || this.businessUnitId || "Unknown";

      return `New conversation "${subject}" started by ${participantName} (${businessUnit})`;
    },
  },
};
