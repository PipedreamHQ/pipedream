const _ = require("lodash");
const googleCalendar = require("https://github.com/PipedreamHQ/pipedream/components/google-calendar/google-calendar.app.js");

module.exports = {
  name: "google-calendar-event-ended",
  version: "0.0.1",
  dedupe: "unique", // Dedupe events based on the Google Calendar event ID
  props: {
    googleCalendar,
    calendarId: {
      type: "string",
      async options() {
        const calListResp = await this.googleCalendar.calendarList();
        const calendars = _.get(calListResp, "data.items");
        if (calendars) {
          const calendarIds = calendars.map((item) => {
            return { value: item.id, label: item.summary };
          });
          return calendarIds;
        }
        return [];
      },
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 5 * 60,
      },
    },
  },
  async run(event) {
    const intervalMs = 1000 * (event.interval_seconds || 300); // fall through to default for manual testing
    const now = new Date();

    const timeMin = new Date(now.getTime() - intervalMs).toISOString();
    const timeMax = new Date(now.getTime()).toISOString();

    const config = {
      calendarId: this.calendarId,
      timeMax,
      timeMin,
      singleEvents: true,
      orderBy: this.orderBy,
    };
    const resp = await this.googleCalendar.getEvents(config);

    const events = _.get(resp.data, "items");
    if (Array.isArray(events)) {
      for (const event of events) {
        const eventEnd = _.get(event, "end.dateTime");
        const end = new Date(eventEnd);
        const msFromEnd = now.getTime() - end.getTime();
        if (eventEnd && msFromEnd > 0 && msFromEnd < intervalMs) {
          const { summary, id } = event;
          this.$emit(event, {
            summary,
            id,
            ts: +new Date(event.start.dateTime),
          });
        }
      }
    } else {
      console.log("nothing to emit");
    }
  },
};
