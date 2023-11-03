import base from "../common/base.mjs";

export default {
  ...base,
  key: "teamup-event-start",
  name: "Event Start",
  description: "Emit new event when an event is created on a specified calendar.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    timeBeforeEvent: {
      type: "integer",
      label: "Minutes Before Event Starts",
      description: "The number of minutes before the event starts to emit event",
    },
  },
  methods: {
    ...base.methods,
    getParams() {
      return {
        startDate: this.teamup.getFormattedDate(0),
        endDate: this.teamup.getFormattedDate(30),
      };
    },
    isRelevant({
      event, timestamp,
    }) {
      return Date.parse(event.start_dt) / 1000 < (timestamp + (this.timeBeforeEvent * 60));
    },
    generateMeta(event, timestamp) {
      return {
        id: event.id,
        summary: `Event ${event.title} starting in ${this.timeBeforeEvent} minutes`,
        ts: timestamp,
      };
    },
  },
};
