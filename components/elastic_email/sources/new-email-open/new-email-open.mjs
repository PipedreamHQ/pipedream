import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "elastic_email-new-email-open",
  name: "New Email Open",
  description: "Emit new event when a recipient opens an email. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#operation/eventsGet).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "Open",
      ];
    },
    getDateField() {
      return "EventDate";
    },
    getIdField() {
      return "MsgID";
    },
    getSummary() {
      return "New Email opened";
    },
  },
  sampleEmit,
};
