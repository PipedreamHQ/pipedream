const _ = require("lodash");
const googleCalendar = require("../../google_calendar.app.js");

module.exports = {
  key: "google_calendar-new-calendar",
  name: "New Calendar",
  description: "Emit an event when a calendar is created.",
  version: "0.0.2",
  type: "source",
  props: {
    db: "$.service.db",
    googleCalendar,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 5 * 60,
      },
    },
  },
  hooks: {
    async activate() {
      // get list of calendars
      const calListResp = await this.googleCalendar.calendarList();
      const calendars = _.get(calListResp, "data.items");
      const calendarIds = calendars.map((item) => item.id);
      this.db.set("calendarIds", calendarIds);
    },
    deactivate() {
      this.db.set("calendarIds", []);
    },
  },
  async run() {
    const previousCalendarIds = this.db.get("calendarIds") || [];

    const calListResp = await this.googleCalendar.calendarList();
    const calendars = _.get(calListResp, "data.items");
    const currentCalendarIds = [];

    for (const calendar of calendars) {
      currentCalendarIds.push(calendar.id);
      if (!previousCalendarIds.includes(calendar.id)) {
        const {
          summary,
          id,
        } = calendar;
        this.$emit(calendar, {
          summary,
          id,
        });
      }
    }
    this.db.set("calendarIds", currentCalendarIds);
  },
};
