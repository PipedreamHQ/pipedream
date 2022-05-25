import googleCalendar from "../google_calendar.app.mjs";

export default {
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60,
      },
    },
  },
  hooks: {
    async activate() {
      await this.processEvents({});
    },
  },
  methods: {
    getIntervalData(event) {
      const intervalMs = 1000 * (event.interval_seconds ?? 300); // fall through to default for manual testing
      const now = new Date();
      const past = new Date(now.getTime() - intervalMs);
      return {
        intervalMs,
        now,
        past,
      };
    },
    getConfig() {
      throw new Error("getConfig is not implemented");
    },
    isRelevant() {
      return true;
    },
    generateMeta(event) {
      const {
        summary,
        id,
        start,
      } = event;
      return {
        summary,
        id,
        ts: +new Date(start.dateTime),
      };
    },
    async processEvents(event) {
      const intervalData = this.getIntervalData(event);
      const config = this.getConfig(intervalData);
      const resp = await this.googleCalendar.getEvents(config);

      const events = resp?.data?.items;
      if (!Array.isArray(events)) {
        console.log("nothing to emit");
        return;
      }
      for (const event of events) {
        if (this.isRelevant(event, intervalData)) {
          const meta = this.generateMeta(event);
          this.$emit(event, meta);
        }
      }
    },
  },
  async run(event) {
    await this.processEvents(event);
  },
};
