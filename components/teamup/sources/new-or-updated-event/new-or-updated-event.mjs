import base from "../common/base.mjs";

export default {
  ...base,
  key: "teamup-new-or-updated-event",
  name: "New or Updated Event",
  description: "Emit new event when an event is created or updated on a specified calendar.",
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
    isRelevant({
      event, lastTs,
    }) {
      return event?.update_dt
        ? Date.parse(event.update_dt) > lastTs
        : Date.parse(event.creation_dt) > lastTs;
    },
    generateMeta(event) {
      const ts = Date.parse(event.update_dt);
      return {
        id: `${event.id}${event.id}`,
        summary: `Updated Event - ${event.title}`,
        ts,
      };
    },
  },
};
