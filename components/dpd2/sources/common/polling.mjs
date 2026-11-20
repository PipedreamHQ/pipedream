import dpd2 from "../../dpd2.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

// Each check rereads the day before the newest record seen, and emits the
// records in it that it hasn't seen yet. The overlap catches purchases that
// show up late: the API lists only active purchases, by when they were made,
// so a payment that clears after a few minutes appears with an earlier date.
const OVERLAP_SECONDS = 86400;

export default {
  props: {
    dpd2,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(25);
    },
  },
  methods: {
    /**
     * The records to check, oldest first
     * @params {string} [since] - An ISO 8601 date and time. Lists that the API
     * can filter by date start here; the rest can ignore it.
     * @returns {Promise<Object[]>}
     */
    // eslint-disable-next-line no-unused-vars
    getRecords(since) {
      throw new Error("getRecords is not implemented");
    },
    // eslint-disable-next-line no-unused-vars
    generateMeta(record) {
      throw new Error("generateMeta is not implemented");
    },
    _getLastCreatedAt() {
      return this.db.get("lastCreatedAt");
    },
    _setLastCreatedAt(lastCreatedAt) {
      this.db.set("lastCreatedAt", lastCreatedAt);
    },
    _getSeenIds() {
      return this.db.get("seenIds") || [];
    },
    _setSeenIds(seenIds) {
      this.db.set("seenIds", seenIds);
    },
    async processEvents(max) {
      const lastCreatedAt = this._getLastCreatedAt();
      const since = lastCreatedAt && lastCreatedAt - OVERLAP_SECONDS;
      const records = (await this.getRecords(since && this.dpd2.toIsoDate(since)) || [])
        .filter((record) => !since || Number(record.created_at) >= since);

      const seen = new Set(this._getSeenIds());
      let fresh = records.filter(({ id }) => !seen.has(id))
        .sort((a, b) => Number(a.created_at) - Number(b.created_at) || a.id - b.id);
      if (max) {
        fresh = fresh.slice(-max);
      }

      const createdAt = ({ created_at: timestamp }) => Number(timestamp);
      const newest = Math.max(lastCreatedAt || 0, ...records.map(createdAt));
      for (const record of fresh) {
        this.$emit(record, this.generateMeta(record));
      }

      if (newest) {
        this._setLastCreatedAt(newest);
        this._setSeenIds(records
          .filter((record) => createdAt(record) >= newest - OVERLAP_SECONDS)
          .map(({ id }) => id));
      }
    },
  },
  async run() {
    await this.processEvents();
  },
};
