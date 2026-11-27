import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../signalraven.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll SignalRaven for new items",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    _getResumeOffset() {
      return this.db.get("resumeOffset") || 0;
    },
    _getResumeNewestTs() {
      return this.db.get("resumeNewestTs") || 0;
    },
    _setResume(offset, newestTs) {
      this.db.set("resumeOffset", offset);
      this.db.set("resumeNewestTs", newestTs);
    },
    _clearResume() {
      this.db.set("resumeOffset", 0);
      this.db.set("resumeNewestTs", 0);
    },
    getTs(item) {
      return Date.parse(item.createdAt) || Date.now();
    },
    /** One page of items, newest first. Sources implement this. */
    async fetchPage() {
      throw new Error("fetchPage is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    /**
     * Walk pages newest-first from `offset` until a page is short, a
     * page's oldest item is at or before the watermark, or the page cap
     * is reached. Returns the items newer than the watermark plus
     * whether the walk finished. An unfinished walk must NOT advance the
     * watermark: the caller persists a resume offset instead, so a
     * backlog larger than the cap drains across polls without losing
     * events. Boundary items at exactly the watermark are included and
     * the walk continues past a page whose oldest item equals it, so an
     * event sharing the watermark's timestamp is never dropped; dedupe:
     * "unique" absorbs the re-emit of already-seen boundary items.
     */
    async fetchSince(lastTs, offset = 0) {
      const items = [];
      let nextOffset = offset;
      for (let page = 0; page < constants.MAX_SOURCE_PAGES; page++) {
        const batch = await this.fetchPage(nextOffset);
        items.push(...batch);
        nextOffset += constants.MAX_LIMIT;
        if (batch.length < constants.MAX_LIMIT) {
          return {
            items: items.filter((item) => this.getTs(item) >= lastTs),
            finished: true,
          };
        }
        const oldest = Math.min(...batch.map((item) => this.getTs(item)));
        if (oldest < lastTs) {
          return {
            items: items.filter((item) => this.getTs(item) >= lastTs),
            finished: true,
          };
        }
      }
      return {
        items,
        finished: false,
        nextOffset,
      };
    },
    emitItems(items) {
      items
        .slice()
        .reverse()
        .forEach((item) => this.$emit(item, this.generateMeta(item)));
    },
    maxTs(items) {
      return items.length
        ? Math.max(...items.map((item) => this.getTs(item)))
        : 0;
    },
  },
  hooks: {
    async deploy() {
      // Emit the most recent items on deploy so the workflow has sample events.
      const batch = await this.fetchPage(0);
      this.emitItems(batch.slice(0, 10));
      if (batch.length) {
        this._setLastTs(this.maxTs(batch));
      }
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    const resumeOffset = this._getResumeOffset();
    const candidateTs = this._getResumeNewestTs();
    const {
      items, finished, nextOffset,
    } = await this.fetchSince(lastTs, resumeOffset);
    this.emitItems(items);
    const newest = Math.max(candidateTs, this.maxTs(items));
    if (finished) {
      if (newest > lastTs) {
        this._setLastTs(newest);
      }
      this._clearResume();
      return;
    }
    // Page cap hit before reaching the watermark: keep the watermark where
    // it is and continue from the next offset on the following poll.
    this._setResume(nextOffset, newest);
    console.log(`Backlog larger than ${constants.MAX_SOURCE_PAGES} pages; resuming from offset ${nextOffset} next poll`);
  },
};
