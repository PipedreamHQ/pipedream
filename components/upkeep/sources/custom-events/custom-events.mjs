import common from "../common/common.mjs";
import eventTypes from "../common/eventTypes.mjs";

export default {
  key: "upkeep-new-custom-events",
  name: "New Custom Event",
  description: "Emit new event when a configured event occurs.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  ...common,
  props: {
    ...common.props,
    events: {
      type: "string[]",
      label: "Event types",
      description: "Select from available UpKeep event types.",
      options: eventTypes,
    },
  },
  methods: {
    ...common.methods,
    getTitle() {
      return "Pipedream - New Events";
    },
    getEvents() {
      return this.events;
    },
    getSummarry(item) {
      return `New custom event (ITEM ID:${item?.id})`;
    },
    getTime() {
      return new Date().getTime();
    },
  },
};
