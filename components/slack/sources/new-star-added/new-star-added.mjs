import common from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "slack-new-star-added",
  name: "New Star Added (Instant)",
  version: "0.0.17",
  description: "Emit new event when a star is added to an item",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    // eslint-disable-next-line pipedream/props-description,pipedream/props-label
    slackApphook: {
      type: "$.interface.apphook",
      appProp: "slack",
      async eventNames() {
        return [
          "star_added",
        ];
      },
    },
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "The types of event to emit. If not specified, all events will be emitted.",
      options: constants.eventsOptions,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getSummary({ item: { type } }) {
      return `New star added - ${constants.events[type] ?? type}`;
    },
    async processEvent(event) {
      if (this.eventTypes == null
        || this.eventTypes.length === 0
        || this.eventTypes.includes(event.item.type)) {
        return event;
      }
    },
  },
};
