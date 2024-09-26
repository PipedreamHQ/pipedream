import base from "../common/base.mjs";

export default {
  ...base,
  key: "teamup-new-event",
  name: "New Event",
  description: "Emit new event when an event is created on a specified calendar.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getParams(lastTs) {
      return {
        modifiedSince: lastTs
          ? lastTs
          : Date.parse(this.teamup.getFormattedDate(-29)) / 1000,
      };
    },
    getTsField() {
      return "creation_dt";
    },
    isRelevant({
      event, lastTs,
    }) {
      return Date.parse(event.creation_dt) / 1000 > lastTs;
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New Event - ${event.title}`,
        ts: Date.parse(event.creation_dt),
      };
    },
  },
};
