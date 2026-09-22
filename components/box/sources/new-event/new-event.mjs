// x-pd-ai: optimized
import common from "../common/common.mjs";
import eventsTypes from "../common/eventTypes.mjs";

export default {
  key: "box-new-event",
  name: "New Event",
  description: "Emit new event when any of the selected event types occurs on the target file or folder, via a Box webhook. [See the documentation](https://developer.box.com/reference/post-webhooks)",
  version: "0.0.10",
  type: "source",
  dedupe: "unique",
  ...common,
  props: {
    ...common.props,
    events: {
      type: "string[]",
      label: "Event types",
      description: "The event types that trigger the webhook (e.g. `FILE.UPLOADED`, `FOLDER.CREATED`). [See the full list of event triggers](https://developer.box.com/reference/post-webhooks/#param-triggers).",
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
