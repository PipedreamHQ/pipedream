import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import donethat from "../../donethat.app.mjs";
import utils from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

// How many recent days each run checks, so a summary that was not ready yet,
// or a run missed during an outage, is still emitted later.
const MAX_CATCH_UP_DAYS = 7;

export default {
  key: "donethat-new-daily-summary",
  name: "New Daily Summary",
  description: "Emit new event when DoneThat's daily summary for the previous day is available."
    + " Polls for yesterday's summary in the chosen time zone and emits it once per date."
    + " A summary that is not ready yet is checked again on later runs for up to 7 days."
    + " Each run checks dates in order, so a delayed summary can arrive after a later day's."
    + " [See the documentation](https://donethat.ai/api-reference/messages)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    donethat,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The IANA time zone used to work out which day was yesterday, e.g. `Europe/Berlin`."
        + " Set it to the time zone of your DoneThat account. Defaults to `UTC`.",
      default: "UTC",
      optional: true,
    },
    format: {
      propDefinition: [
        donethat,
        "summaryFormat",
      ],
    },
  },
  methods: {
    _getLastEmittedDate() {
      return this.db.get("lastEmittedDate");
    },
    _setLastEmittedDate(date) {
      this.db.set("lastEmittedDate", date);
    },
    generateMeta(date, summary) {
      return {
        id: date,
        summary: summary.metadata?.subject || `Daily summary for ${date}`,
        ts: Date.now(),
      };
    },
    /**
     * Fetch the daily summary for one date.
     * @param {string} date - A `YYYY-MM-DD` calendar date
     * @returns {Promise<object|null>} The summary, or `null` if DoneThat has not generated it yet
     */
    async _getDailySummary(date) {
      try {
        return await this.donethat.getSummary({
          params: {
            date,
            level: "day",
            format: this.format,
          },
        });
      } catch (error) {
        // 404 means DoneThat has not generated the summary for this date yet
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
  },
  async run() {
    const latestDate = utils.getYesterdayInTimeZone(this.timeZone || "UTC");
    const earliestDate = utils.addDays(latestDate, -(MAX_CATCH_UP_DAYS - 1));

    // `lastEmittedDate` is the last date of an unbroken run of emitted summaries:
    // every date after it is still pending. The first run starts with yesterday.
    let lastEmittedDate = this._getLastEmittedDate();
    if (!lastEmittedDate) {
      lastEmittedDate = utils.addDays(latestDate, -1);
      this._setLastEmittedDate(lastEmittedDate);
    }

    let date = utils.addDays(lastEmittedDate, 1);
    if (date < earliestDate) {
      date = earliestDate;
    }

    // A pending date stops `lastEmittedDate` from advancing, so it is retried on
    // the next run. Later dates are still emitted now; when they are checked
    // again, `dedupe: "unique"` on the date drops the repeat.
    let unbroken = true;
    for (; date <= latestDate; date = utils.addDays(date, 1)) {
      const summary = await this._getDailySummary(date);
      if (!summary) {
        unbroken = false;
        continue;
      }
      this.$emit({
        date,
        ...summary,
      }, this.generateMeta(date, summary));
      if (unbroken) {
        this._setLastEmittedDate(date);
      }
    }
  },
  sampleEmit,
};
