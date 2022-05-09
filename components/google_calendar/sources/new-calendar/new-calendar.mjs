import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-new-calendar",
  name: "New Calendar",
  description: "Emit an event when a calendar is created.",
  version: "0.1.0",
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
      const { items: calendars = [] } = await this.googleCalendar.listCalendars();
      const calendarIds = calendars.map((item) => item.id);
      this.setCalendarIds(calendarIds);
    },
    deactivate() {
      this.setCalendarIds([]);
    },
  },
  methods: {
    setCalendarIds(calendarIds) {
      this.db.set("calendarIds", calendarIds);
    },
    getCalendarIds() {
      return this.db.get("calendarIds") || [];
    },
  },
  async run() {
    const previousCalendarIds = this.getCalendarIds();

    const { items: calendars = [] } = await this.googleCalendar.listCalendars();
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
    this.setCalendarIds(currentCalendarIds);
  },
};
