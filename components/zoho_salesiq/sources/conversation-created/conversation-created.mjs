import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_salesiq-conversation-created",
  name: "New Conversation Created",
  description: "Emit new event when a new conversation is created.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "conversation.created",
      ];
    },
    generateMeta(body) {
      return {
        id: body.entity_id,
        summary: body.entity.question,
        ts: body.event_time,
      };
    },
  },
  sampleEmit,
};
