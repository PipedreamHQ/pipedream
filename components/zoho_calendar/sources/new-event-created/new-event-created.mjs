import base from "../common/base.mjs";

export default {
  ...base,
  key: "zoho_calendar-new-event-created",
  name: "New Event Created",
  description: "Emit new item when a new event is created. [See the documentation](https://www.zoho.com/calendar/help/api/get-events-list.html)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    generateMeta(event) {
      return {
        id: event.uid,
        summary: `New event: ${event.title}`,
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
