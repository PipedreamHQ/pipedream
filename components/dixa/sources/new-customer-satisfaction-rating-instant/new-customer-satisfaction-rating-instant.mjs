import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dixa-new-customer-satisfaction-rating-instant",
  name: "New Customer Satisfaction Rating (Instant)",
  description: "Emit new event when a customer submits a satisfaction rating for a conversation. [See the documentation](https://docs.dixa.io/openapi/dixa-api/v1/tag/Webhooks/).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "ConversationRated",
      ];
    },
    getSummary({ data }) {
      return  `New satisfaction rating for conversation ${data.conversation.csid}`;
    },
  },
  sampleEmit,
};
