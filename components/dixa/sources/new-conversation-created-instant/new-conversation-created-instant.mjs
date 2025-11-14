import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dixa-new-conversation-created-instant",
  name: "New Conversation Created (Instant)",
  description: "Emit new event when a conversation is created in Dixa. [See the documentation](https://docs.dixa.io/openapi/dixa-api/v1/tag/Webhooks/).",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "ConversationCreated",
      ];
    },
    getSummary({ data }) {
      return `New conversation created with Id: ${data.conversation.csid}`;
    },
  },
  sampleEmit,
};
