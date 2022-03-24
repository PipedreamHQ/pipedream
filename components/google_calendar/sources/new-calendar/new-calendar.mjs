import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-new-calendar",
  name: "New Calendar",
  description: "Emit new event when a calendar is created.",
  version: "0.0.3",
  type: "source",
  props: {
    db: "$.service.db",
    googleCalendar,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60,
      },
    },
  },
  hooks: {
    async activate() {
      // get list of calendars
      const calListResp = await this.googleCalendar.calendarList();
      const calendars = calListResp?.data.items;
      this.emitNewCalendars(calendars);

      const calendarIds = calendars.map((item) => item.id);
      this.db.set("calendarIds", calendarIds);
    },
    deactivate() {
      this.db.set("calendarIds", []);
    },
  },
  methods: {
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
      const previousCalendarIds = this.db.get("calendarIds") || [];

      for (const calendar of calendars) {
        if (!previousCalendarIds.includes(calendar.id)) {
          const meta = this.generateMeta(calendar);
          this.$emit(calendar, meta);
        }
      }
    },
  },
  async run() {
    const calListResp = await this.googleCalendar.calendarList();
    const calendars = calListResp?.data?.items;

    this.emitNewCalendars(calendars);

    const calendarIds = calendars.map((item) => item.id);
    this.db.set("calendarIds", calendarIds);
  },
};
