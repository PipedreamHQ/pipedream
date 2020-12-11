const common = require("../common/http-based");

module.exports = {
  ...common,
  key: "sendgrid-delivery-events",
  name: "Delivery Events (Instant)",
  description: "Emit an event when a delivery event is detected in SendGrid",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    eventTypes: {
      type: "string[]",
      label: "Delivery Event Types",
      description: "The type of delivery events to listen to",
      options(context) {
        const { page } = context;
        if (page !== 0) {
          return {
            options: [],
          };
        }

        const options = require('./delivery-event-types');
        return {
          options,
        };
      }
    },
  },
  methods: {
    ...common.methods,
    webhookEventFlags() {
      return this.eventTypes.reduce((accum, eventType) => ({
        ...accum,
        [eventType]: true,
      }), {});
    },
    generateMeta(data) {
      const base = common.methods.generateMeta(data);
      const {
        event: eventType,
      } = data;
      const summary = `New delivery event: ${eventType}`;
      return {
        ...base,
        summary,
      };
    },
  },
};
