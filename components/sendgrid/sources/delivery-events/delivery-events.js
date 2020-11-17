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
    processed: {
      type: "boolean",
      label: "Processed",
      description: `
        When set, an event will be emitted each time a message has been
        received and is ready to be delivered
      `,
      default: true,
    },
    dropped: {
      type: "boolean",
      label: "Dropped",
      description: `
        If set, an event will be emitted each time a message has been
        dropped, regardless of the reason (which is provided as part of
        the emitted event)
      `,
      default: true,
    },
    delivered: {
      type: "boolean",
      label: "Delivered",
      description: `
        If set, an event will be emitted each time a message has been
        successfully delivered to the receiving server
      `,
      default: true,
    },
    deferred: {
      type: "boolean",
      label: "Deferred",
      description: `
        When set, an event will be emitted if the receiving server
        temporarily rejected the message
      `,
      default: true,
    },
    bounce: {
      type: "boolean",
      label: "Bounce",
      description: `
        When set, an event will be emitted if the receiving server could not
        or would not accept mail to this recipient permanently.
        If a recipient has previously unsubscribed from your emails,
        the message is dropped.
      `,
      default: true,
    },
  },
  methods: {
    ...common.methods,
    webhookEventFlags() {
      return {
        processed: this.processed,
        dropped: this.dropped,
        delivered: this.delivered,
        deferred: this.deferred,
        bounce: this.bounce,
      };
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
