import common from "../common/http-based.mjs";
import constants from "../constants.mjs";

export default {
  ...common,
  key: "mailchimp-new-list-event",
  name: "New List Event (Instant)",
  description: "Emit new event when the following occurs on an audience list: a campaign is sent or cancelled, a subscriber is added, unsubscribed, has a profile update, or has the associated email address changed, or cleaned.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    events: {
      type: "string[]",
      label: "Events",
      description: "The events to be emitted, which will trigger the source being created",
      default: [
        "subscribe",
      ],
      options: constants.EVENT_TYPES,
    },
  },
  methods: {
    ...common.methods,
    getEventTypes() {
      return this.events;
    },
    generateMeta(eventPayload) {
      const {
        "data[id]": id,
        "fired_at": timestampStr,
        "type": eventType,
      } = eventPayload;
      return {
        id,
        summary: `New event: '${eventType}' (${id})`,
        ts: Date.parse(timestampStr),
      };
    },
  },
};
