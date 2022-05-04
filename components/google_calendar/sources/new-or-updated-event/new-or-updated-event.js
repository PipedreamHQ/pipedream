const _ = require("lodash");
const googleCalendar = require("../../google_calendar.app.js");

module.exports = {
  key: "google_calendar-new-or-updated-event",
  name: "New or Updated Event",
  description: "Emits when an event is created or updated (except when it's cancelled)",
  version: "0.0.2",
  type: "source",
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
            return {
              value: item.id,
              label: item.summary,
            };
          });
          return calendarIds;
        }
        return [];
      },
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 5 * 60, // five minutes
      },
    },
  },
  async run(event) {
    const intervalMs = 1000 * (event.interval_seconds || 300); // fall through to default for manual testing
    const now = new Date();
    const past = new Date(now.getTime() - intervalMs);

    const updatedMin = past.toISOString();

    const config = {
      calendarId: this.calendarId,
      updatedMin,
      singleEvents: true,
      orderBy: "startTime",
    };
    const resp = await this.googleCalendar.getEvents(config);

    const events = _.get(resp.data, "items");
    if (Array.isArray(events)) {
      for (const event of events) {
        if (event.status !== "cancelled") {
          const {
            summary,
            id,
          } = event;
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
