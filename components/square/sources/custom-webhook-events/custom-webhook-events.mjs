import base from "../common/base.mjs";

export default {
  ...base,
  key: "square-custom-webhook-events",
  name: "Custom Webhook Events",
  description: "Receive notifications for custom webhook events. [See docs here](https://developer.squareup.com/docs/webhooks/v2webhook-events-tech-ref).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...base.props,
    eventTypes: {
      propDefinition: [
        base.props.square,
        "eventTypes",
      ],
    },
  },
  methods: {
    ...base.methods,
    getEventTypes() {
      return this.eventTypes;
    },
    getSummary(event) {
      return `New ${event.type} event: ${event.data.id}`;
    },
    getTimestamp(event) {
      return new Date(event.created_at);
    },
  },
};
