import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import algodocs from "../../algodocs.app.mjs";
import {
  getRecordTimestamp, normalizeRecords,
} from "../../common/utils.mjs";

const FIRST_RUN_LIMIT = 25;

export default {
  props: {
    algodocs,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Interval",
      description: "Pipedream will poll the AlgoDocs API on this schedule",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    documentId: {
      propDefinition: [
        algodocs,
        "documentId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent();
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    async processEvent() {
      const response = await this.algodocs.getExtractedDataByDocument({
        documentId: this.documentId,
      });
      const records = normalizeRecords(response);
      if (!records.length) {
        return;
      }

      const lastTs = this._getLastTs();
      const isFirstRun = lastTs == null;

      // The API returns records newest-first, so we iterate in that order.
      const entries = [];
      for (const record of records) {
        const ts = getRecordTimestamp(record);

        if (ts == null) {
          console.error(`Skipping AlgoDocs record ${record?.id}: missing or unparseable processedAt/uploadedAt timestamp`);
          continue;
        }

        // Records are sorted newest-first (see above), so once we reach one at
        // or before lastTs (subsequent runs), or hit the first-run cap, every
        // remaining record is either already seen or beyond the limit - stop.
        if ((!isFirstRun && ts < lastTs) || (isFirstRun && entries.length === FIRST_RUN_LIMIT)) {
          break;
        }

        entries.push(...this.extractItems(record, ts));
      }

      // On first run, everything below the oldest examined (capped) entry is
      // intentionally never looked at again. On later runs, every examined entry
      // advances the watermark, matched or not, so an unmatched entry isn't
      // rescanned forever and a matched-but-older entry is never skipped.
      // Entries are still newest-first, so the oldest examined one is the last.
      let watermark = lastTs ?? 0;
      if (isFirstRun && entries.length) {
        watermark = entries[entries.length - 1].ts;
      }

      for (const entry of entries) {
        if (!isFirstRun && entry.ts > watermark) {
          watermark = entry.ts;
        }

        if (!this.matchesFilter(entry)) {
          continue;
        }

        this.$emit(entry.payload, {
          id: entry.id,
          summary: entry.summary,
          ts: entry.ts,
        });
      }

      if (watermark > (lastTs ?? 0)) {
        this._setLastTs(watermark);
      }
    },
  },
  async run() {
    await this.processEvent();
  },
};
