import common from "../common/http-based.mjs";
import deliveryEventTypes from "../common/delivery-event-types.mjs";
import engagementEventTypes from "../common/engagement-event-types.mjs";

export default {
  ...common,
  key: "sendgrid-events",
  name: "New Events (Instant)",
  description: "Emit new event when any of the specified SendGrid events is received",
  version: "0.0.4",
  type: "source",
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
          ...deliveryEventTypes,
          ...engagementEventTypes,
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
        ...deliveryEventTypes,
        ...engagementEventTypes,
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
