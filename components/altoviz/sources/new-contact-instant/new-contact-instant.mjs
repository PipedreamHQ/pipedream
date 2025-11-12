import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "altoviz-new-contact-instant",
  name: "New Contact (Instant)",
  description: "Emit new event each time a contact is created, updated or deleted in Altoviz.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "Select the contact event types to watch for",
      options: [
        "ContactCreated",
        "ContactUpdated",
        "ContactDeleted",
      ],
    },
  },
  sampleEmit,
};
