import common from "../common/base.mjs";

export default {
  ...common,
  key: "elastic_email-new-delivery-event",
  name: "New Delivery Event",
  description: "Emit new event when a delivery event occurs. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#operation/eventsGet).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "The type of events to listen for",
      options: [
        "Submission",
        "FailedAttempt",
        "Bounce",
        "Sent",
        "Open",
        "Click",
        "Unsubscribe",
        "Complaint",
      ],
    },
  },
  methods: {
    ...common.methods,
    getEventType() {
      return this.eventTypes;
    },
    getDateField() {
      return "EventDate";
    },
    getIdField() {
      return "MsgID";
    },
    getSummary() {
      return "New delivery event";
    },
  },
};
