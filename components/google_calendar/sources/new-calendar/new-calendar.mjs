import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-new-calendar",
  name: "New Calendar",
  description: "Emit an event when a calendar is created.",
  version: "0.1.2",
  type: "source",
  props: {
    db: "$.service.db",
    googleCalendar,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  hooks: {
    async activate() {
      // get list of calendars
      const { items: calendars = [] } = await this.googleCalendar.listCalendars();
      this.emitNewCalendars(calendars);
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
    generateMeta(calendar) {
      const {
        summary,
        id,
      } = calendar;
      return {
        summary,
        id,
        ts: Date.now(),
      };
    },
    emitNewCalendars(calendars) {
      const previousCalendarIds = this.getCalendarIds();

      for (const calendar of calendars) {
        if (!previousCalendarIds.includes(calendar.id)) {
          const meta = this.generateMeta(calendar);
          this.$emit(calendar, meta);
        }
      }
    },
  },
  async run() {
    const { items: calendars = [] } = await this.googleCalendar.listCalendars();

    this.emitNewCalendars(calendars);

    const calendarIds = calendars.map((item) => item.id);
    this.setCalendarIds(calendarIds);
  },
};
