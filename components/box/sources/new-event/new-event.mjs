import common from "../common/common.mjs";
import eventsTypes from "../common/eventTypes.mjs";

export default {
  key: "box-new-event",
  name: "New Event",
  description: "Emit new event when an event with subscribed event source triggered on a target. [See the documentation](https://developer.box.com/reference/post-webhooks)",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  ...common,
  props: {
    ...common.props,
    events: {
      type: "string[]",
      label: "Event types",
      description: "The events that trigger the webhook.",
      options: eventsTypes,
    },
  },
  methods: {
    ...common.methods,
    getTriggers() {
      return this.events;
    },
    getSummary(event) {
      const eventType = eventsTypes.find((pair) => pair.value == event?.trigger);
      return  `New ${eventType?.label ?? "unclassified"} event with ID(${event.id})`;
    },
  },
};
