import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dixa-new-tag-added-instant",
  name: "New Tag Added in Conversation (Instant)",
  description: "Emit new event when a tag is added to a conversation. [See the documentation](https://docs.dixa.io/openapi/dixa-api/v1/tag/Webhooks/).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "ConversationTagAdded",
      ];
    },
    getSummary({ data }) {
      return `Tag "${data.tag}" added to conversation ${data.conversation.csid}`;
    },
  },
  sampleEmit,
};
