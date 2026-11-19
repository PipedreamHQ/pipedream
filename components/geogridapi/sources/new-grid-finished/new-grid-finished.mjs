import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import geogridapi from "../../geogridapi.app.mjs";
import {
  FINISHED_STATUSES,
  SOURCE_FIRST_RUN_EVENTS,
  SOURCE_LOOKBACK_MS,
  SOURCE_PAGE_SIZE,
} from "../../common/constants.mjs";
import { gridSummary } from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "geogridapi-new-grid-finished",
  name: "New Grid Finished",
  description: "Emit an event each time a grid of the account finishes, completed or failed, whatever started it (API, **Run Grid**, the console, an MCP client or a repeated grid)."
    + " Optionally only for one listing or one keyword."
    + " The event is the grid without its point details (status, listing, keyword, `summary`); use **Get Grid** with its `id` to read the rank matrix and the competitors."
    + " [See the documentation](https://geogridapi.io/en/docs#grid)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    geogridapi,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    placeId: {
      propDefinition: [
        geogridapi,
        "placeId",
      ],
      description: "Only the grids of this listing, e.g. `ChIJN1t_tDeuEmsRUsoyG83frY4`. Use **Find Business** to get a place ID (the `place_id` field).",
    },
    keyword: {
      propDefinition: [
        geogridapi,
        "keyword",
      ],
      description: "Only the grids of this exact keyword (case-insensitive), e.g. `pizza`.",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      await this.emitFinishedGrids(SOURCE_FIRST_RUN_EVENTS);
    },
  },
  methods: {
    _getLastFinishedAt() {
      return this.db.get("lastFinishedAt") ?? 0;
    },
    _setLastFinishedAt(ts) {
      this.db.set("lastFinishedAt", ts);
    },
    finishedAt(grid) {
      return Date.parse(grid.completed_at ?? grid.created_at);
    },
    // Newest grids first; reads more pages only while they may hold grids created after `sinceCreated`
    // (`null` on the first run: one page only, never the whole history).
    async listRecentGrids(sinceCreated) {
      const grids = [];
      let before;
      for (;;) {
        const page = await this.geogridapi.listGrids({
          params: {
            limit: SOURCE_PAGE_SIZE,
            before,
            place_id: this.placeId,
            keyword: this.keyword,
          },
        });
        grids.push(...page.data);
        const oldest = page.data[page.data.length - 1];
        if (sinceCreated === null || !page.has_more || !page.next_before || !oldest
          || Date.parse(oldest.created_at) < sinceCreated) {
          return grids;
        }
        before = page.next_before;
      }
    },
    async emitFinishedGrids(maxEvents) {
      const lastFinishedAt = this._getLastFinishedAt();
      const grids = await this.listRecentGrids(lastFinishedAt
        ? lastFinishedAt - SOURCE_LOOKBACK_MS
        : null);
      let finished = grids
        .filter((grid) => FINISHED_STATUSES.includes(grid.status) && this.finishedAt(grid) > lastFinishedAt)
        .sort((a, b) => this.finishedAt(a) - this.finishedAt(b));
      if (maxEvents) {
        finished = finished.slice(-maxEvents);
      }
      if (!finished.length) return;
      for (const grid of finished) {
        this.$emit(grid, {
          id: grid.id,
          summary: gridSummary(grid),
          ts: this.finishedAt(grid),
        });
      }
      this._setLastFinishedAt(this.finishedAt(finished[finished.length - 1]));
    },
  },
  async run() {
    await this.emitFinishedGrids();
  },
  sampleEmit,
};
