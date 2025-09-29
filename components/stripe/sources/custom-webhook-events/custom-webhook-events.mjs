import constants from "../common/constants.mjs";
import sampleEmit from "./test-event.mjs";
import common from "../common/webhook-base.mjs";

export default {
  ...common,
  key: "stripe-custom-webhook-events",
  name: "New Custom Webhook Events",
  type: "source",
  version: "0.1.4",
  description: "Emit new event on each webhook event",
  props: {
    ...common.props,
    enabledEvents: {
      type: "string[]",
      label: "Events",
      description: "Events to listen for. Select `*` for all events",
      options: constants.WEBHOOK_EVENTS,
      default: [
        "*",
      ],
    },
  },
  methods: {
    ...common.methods,
    getEvents() {
      return this.enabledEvents;
    },
  },
  sampleEmit,
};
