import base from "../common/base.mjs";

export default {
  ...base,
  key: "zoho_calendar-event-updated",
  name: "New Updated Event",
  description: "Emit new item when an event is updated. [See the documentation](https://www.zoho.com/calendar/help/api/get-events-list.html)",
  version: "0.0.2",
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
  async run({ $ }) {
    const { calendarId } = this;

    const params = {
      lastmodified: this.getLastModified(),
    };

    const { events } = await this.app.listEvents({
      $,
      calendarId,
      params,
    });
    const sortedEvents = events.sort((a, b) => a.createdtime_millis - b.createdtime_millis);

    for (const event of sortedEvents) {
      this.$emit(event, this.generateMeta(event));
      this.setLastModified(
        this.convertToMs(event.lastmodifiedtime),
      );
    }
  },
};
