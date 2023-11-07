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
    getTsField(event) {
      return event.update_dt
        ? "update_dt"
        : "creation_dt";
    },
    isRelevant({
      event, lastTs,
    }) {
      return event?.update_dt
        ? Date.parse(event.update_dt) / 1000 > lastTs
        : Date.parse(event.creation_dt) / 1000 > lastTs;
    },
    generateMeta(event) {
      const ts = Date.parse(event.update_dt);
      return {
        id: `${event.id}${ts}`,
        summary: `Updated Event - ${event.title}`,
        ts,
      };
    },
  },
};
