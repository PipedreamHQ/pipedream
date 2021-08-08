const common = require("../common/http-based");

module.exports = {
  ...common,
  key: "sendgrid-events",
  name: "Events (Instant)",
  description: "Emit an event when any of the specified SendGrid events is received",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "The type of events to listen to",
      options(context) {
        const { page } = context;
        if (page !== 0) {
          return {
            options: [],
          };
        }

        const options = [
          ...require("./delivery-event-types"),
          ...require("./engagement-event-types"),
        ];
        return {
          options,
        };
      },
    },
  },
  methods: {
    ...common.methods,
    baseWebhookSettings() {
      // The list of events that a webhook can listen to. This method returns an
      // exhaustive list of all such flags disabled, and each event source can
      // then override the flags that are relevant to the event they handle.
      //
      // See the docs for more information:
      // https://sendgrid.com/docs/api-reference/
      const eventTypesData = [
        ...require("./delivery-event-types"),
        ...require("./engagement-event-types"),
      ];
      return eventTypesData.reduce((accum, eventTypeData) => ({
        ...accum,
        [eventTypeData.value]: false,
      }), {});
    },
    webhookEventFlags() {
      return this.eventTypes.reduce((accum, eventType) => ({
        ...accum,
        [eventType]: true,
      }), {});
    },
    generateMeta(data) {
      const {
        event: eventType,
        sg_event_id: id,
        timestamp: ts,
      } = data;
      const summary = `New event: ${eventType}`;
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
