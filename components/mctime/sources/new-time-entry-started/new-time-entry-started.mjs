import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import mctime from "../../mctime.app.mjs";

export default {
  key: "mctime-new-time-entry-started",
  name: "New Time Entry Started",
  description: "Emit new event each time a new time entry is started",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    mctime,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastStarted() {
      return this.db.get("lastStarted");
    },
    _setLastStarted(lastStarted) {
      this.db.set("lastStarted", lastStarted);
    },
    generateMeta(data) {
      const {
        id, from,
      } = data;
      return {
        id,
        summary: `New Time Entry: ${id}`,
        ts: Date.parse(from),
      };
    },
    getDateTimeWithOffset(date) {
      date = new Date(date);
      const offsetMinutes = date.getTimezoneOffset();
      const offsetHours = Math.abs(Math.floor(offsetMinutes / 60));
      const offsetMinutesRemainder = Math.abs(offsetMinutes % 60);
      const offsetSign = offsetMinutes > 0
        ? "-"
        : "+";
      const offsetFormatted = offsetSign + (offsetHours < 10
        ? "0"
        : "") + offsetHours + ":" + (offsetMinutesRemainder < 10
        ? "0"
        : "") + offsetMinutesRemainder;
      const isoString = date.toISOString().split(".")[0];
      return isoString + offsetFormatted;
    },
  },
  async run() {
    const currentDate = new Date();
    const to = this.getDateTimeWithOffset(currentDate);
    let lastStarted = this._getLastStarted()
      || this.getDateTimeWithOffset(currentDate.setDate(currentDate.getDate() - 7)); // if no lastStarted get date from one week ago
    const params = {
      to,
      from: lastStarted,
      page: 1,
    };
    let total;
    do {
      const { items } = await this.mctime.getTimeEntries({
        params,
      });
      const timeEntries = items[0].data.timeEntries;
      for (const timeEntry of timeEntries) {
        for (const time of timeEntry.times) {
          if (Date.parse(time.from) > Date.parse(lastStarted)) {
            lastStarted = time.from;
          }
          const meta = this.generateMeta(time);
          this.$emit(time, meta);
        }
      }
      total = timeEntries?.length;
      params.page++;
    } while (total);
    this._setLastStarted(lastStarted);
  },
};
