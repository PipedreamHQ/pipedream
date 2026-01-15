import common from "../common/base-webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "confluence_data_center-new-webhook-event",
  name: "New Webhook Event (Instant)",
  description: "Emit new event when a webhook event is received from Confluence Data Center.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    events: {
      type: "string[]",
      label: "Events",
      description: "The events to listen for",
      options: events,
    },
  },
  methods: {
    ...common.methods,
    getEvents() {
      return this.events;
    },
  },
};
