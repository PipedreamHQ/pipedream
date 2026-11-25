import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import donethat from "../../donethat.app.mjs";
import utils from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "donethat-new-daily-summary",
  name: "New Daily Summary",
  description: "Emit new event when DoneThat's daily summary for the previous day is available."
    + " Polls for yesterday's summary in the chosen time zone and emits it once per date."
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
  },
  async run() {
    const date = utils.getYesterdayInTimeZone(this.timeZone || "UTC");
    if (this._getLastEmittedDate() === date) {
      return;
    }

    let summary;
    try {
      summary = await this.donethat.getSummary({
        params: {
          date,
          level: "day",
          format: this.format,
        },
      });
    } catch (error) {
      // 404 means DoneThat has not generated the summary for this date yet
      if (error?.response?.status === 404) {
        return;
      }
      throw error;
    }

    this.$emit({
      date,
      ...summary,
    }, this.generateMeta(date, summary));
    this._setLastEmittedDate(date);
  },
  sampleEmit,
};
