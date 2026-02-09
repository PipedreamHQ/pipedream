import googleCalendar from "../../google_calendar.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    googleCalendar,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
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
        status,
      } = event;
      const baseSummary = summary || `Event ID: ${id}`;
      const statusPrefix = status && status !== "confirmed"
        ? `[${status.toUpperCase()}]`
        : "";
      return {
        summary: `${statusPrefix} ${baseSummary}`.trim(),
        id,
        ts: +new Date(start.dateTime),
      };
    },
    async processEvents(event) {
      const intervalData = this.getIntervalData(event);
      const config = this.getConfig(intervalData);
      const resp = await this.googleCalendar.listEvents(config);

      const events = resp?.data?.items || resp?.items;
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
