import base from "../common/base.mjs";

export default {
  ...base,
  key: "zoho_calendar-event-updated",
  name: "New Updated Event",
  description: "Emit new item when an event is updated. [See the documentation](https://www.zoho.com/calendar/help/api/get-events-list.html)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    generateMeta(event) {
      return {
        id: `${event.uid}+${event.lastmodifiedtime}`,
        summary: `New update: ${event.title}`,
        ts: event.createdtime_millis,
      };
    },
  },
};
