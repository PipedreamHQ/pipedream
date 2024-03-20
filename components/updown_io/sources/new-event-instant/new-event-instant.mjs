import common from "../common/base.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "updown_io-new-event-instant",
  name: "New Event (Instant)",
  description: "Emit new event when a new webhook event occurs. [See the documentation](https://updown.io/api#webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "Filter the incoming events by event type",
      options: events,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getEventTypes() {
      return this.eventTypes;
    },
  },
};
