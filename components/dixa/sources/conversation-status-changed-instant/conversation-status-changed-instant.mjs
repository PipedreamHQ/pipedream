import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dixa-conversation-status-changed-instant",
  name: "New Conversation Status Changed (Instant)",
  description: "Emit new events when the status of a conversation changes (e.g., open, closed, or abandoned). [See the documentation](https://docs.dixa.io/openapi/dixa-api/v1/tag/Webhooks/).",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "ConversationPending",
        "ConversationMessageAdded",
        "ConversationTagAdded",
        "ConversationAssigned",
        "ConversationPendingExpired",
        "ConversationTransferred",
        "ConversationEnqueued",
        "ConversationCreated",
        "ConversationUnassigned",
        "ConversationOpen",
        "ConversationAbandoned",
        "ConversationClosed",
        "ConversationNoteAdded",
        "ConversationEndUserReplaced",
        "ConversationTagRemoved",
        "ConversationRated",
      ];
    },
    getSummary({
      data, event_fqn: eventType,
    }) {
      return `Conversation ${data.conversation.csid} status changed to ${eventType}`;
    },
  },
  sampleEmit,
};
