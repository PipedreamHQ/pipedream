import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import common from "./base.mjs";
import constants from "../../common/constants.mjs";

// Gong makes a call queryable only once it has finished processing it, which is
// well after the time the call started, and `fromDateTime` filters on that
// start time server-side. So a cursor that jumps straight to the newest start
// time it has seen hides every call still being processed behind it, and hides
// it permanently: no later poll ever asks for that range again. Holding the
// cursor behind the present keeps those calls inside the next poll's window
// instead. Calls read a second time are filtered against a ledger of ids
// already emitted; `dedupe: "unique"` remembers only 100, which a busy
// workspace overruns within one window.
//
// The window has to span a whole call and not just the processing that follows
// it, because the filter is on the start time while processing only begins at
// the end. Two hours covers an hour-long call plus the hour that processing is
// generally quoted at; a workspace whose calls run longer, or whose processing
// is slower, can widen it.
const HOUR_MS = 60 * 60 * 1000;
const DEFAULT_PROCESSING_LOOKBACK_HOURS = 2;
const MIN_PROCESSING_LOOKBACK_HOURS = 1;
const MAX_PROCESSING_LOOKBACK_HOURS = 168;

// Local for the same reason as the values above: `common/constants.mjs`
// reaches every action through `gong.app.mjs`, so touching it costs five
// unrelated version bumps.
const EMITTED_IDS = "emittedIds";

export default {
  ...common,
  props: {
    ...common.props,
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    processingLookbackHours: {
      type: "integer",
      label: "Processing Lookback (Hours)",
      description: "How far behind the present to hold the polling cursor (1-168 hours). The window has to cover the length of a call plus the processing that follows it. Raising it prevents future misses; it cannot recover a call the cursor has already passed, which needs the source state cleared.",
      optional: true,
      min: MIN_PROCESSING_LOOKBACK_HOURS,
      max: MAX_PROCESSING_LOOKBACK_HOURS,
      default: DEFAULT_PROCESSING_LOOKBACK_HOURS,
    },
  },
  methods: {
    ...common.methods,
    setLastCreatedAt(value) {
      this.db.set(constants.LAST_CREATED_AT, value);
    },
    getLastCreatedAt() {
      return this.db.get(constants.LAST_CREATED_AT);
    },
    // Call ids are numeric strings past Number's safe range; for digit strings
    // length then lexicographic order is exactly numeric order.
    compareIds(a, b) {
      const aId = String(a);
      const bId = String(b);

      if (/^\d+$/.test(aId) && /^\d+$/.test(bId) && aId.length !== bId.length) {
        return aId.length - bId.length;
      }

      return aId.localeCompare(bId);
    },
    setEmittedIds(value) {
      this.db.set(EMITTED_IDS, value);
    },
    getEmittedIds() {
      return this.db.get(EMITTED_IDS) || [];
    },
    // Only calls the next poll can read again are worth remembering, so the
    // ledger is pruned to the window the cursor reopens and capped.
    pruneEmittedIds(entries, cursor) {
      const cursorMs = Date.parse(cursor);

      // An unparseable `started` is not excluded by the date filter either, so
      // these return on every poll and need their own budget, not a real
      // call's slot.
      const unfilterable = entries
        .filter(({ startedMs }) => !startedMs)
        .sort((a, b) => this.compareIds(b.id, a.id))
        .slice(0, constants.DEFAULT_MAX);
      const dated = entries.filter(({ startedMs }) => startedMs);

      const withinWindow = Number.isNaN(cursorMs)
        ? dated
        : dated.filter(({ startedMs }) => startedMs >= cursorMs);

      // Gong returns the lowest ids first and stops at the same cap, so keeping
      // the lowest ids keeps what the next poll reads back. Observed ordering,
      // not a documented guarantee; `dedupe: "unique"` stays on as a backstop.
      const capped = withinWindow
        .sort((a, b) => this.compareIds(a.id, b.id))
        .slice(0, constants.DEFAULT_MAX);

      return unfilterable.concat(capped);
    },
    nextLastCreatedAt(newest) {
      const previous = this.getLastCreatedAt();
      const newestMs = Date.parse(newest);

      if (Number.isNaN(newestMs)) {
        return previous;
      }

      // The schema bound is client-side only, so a programmatic caller can
      // still push the cursor outside the range Date accepts. Clamp it.
      const lookbackHours = Math.min(
        Math.max(
          this.processingLookbackHours || DEFAULT_PROCESSING_LOOKBACK_HOURS,
          MIN_PROCESSING_LOOKBACK_HOURS,
        ),
        MAX_PROCESSING_LOOKBACK_HOURS,
      );
      const held = Math.min(newestMs, Date.now() - (lookbackHours * HOUR_MS));
      const previousMs = Date.parse(previous);

      // Never hand back a cursor older than the one already stored: an account
      // recording more calls per lag window than a single poll reads would
      // otherwise stop making progress.
      const next = Number.isNaN(previousMs)
        ? held
        : Math.max(previousMs, held);

      return new Date(next).toISOString();
    },
    getResourceName() {
      throw new ConfigurationError("getResourceName is not implemented");
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    getResourceFnArgs() {
      throw new ConfigurationError("getResourceFnArgs is not implemented");
    },
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      return this.$emit(resource, meta);
    },
    getStartedMs(resource) {
      return Date.parse(resource?.started);
    },
    async processResources(resources, max) {
      // Gong orders calls by id, not by start time, so the last element is an
      // arbitrary call. The cursor and `deploy`'s slice both need the newest.
      let descendingResources = Array.from(resources).sort((a, b) => {
        const aMs = this.getStartedMs(a);
        const bMs = this.getStartedMs(b);
        if (Number.isNaN(aMs) && Number.isNaN(bMs)) {
          return 0;
        }
        if (Number.isNaN(aMs)) {
          return 1;
        }
        if (Number.isNaN(bMs)) {
          return -1;
        }
        return bMs - aMs;
      });

      if (max) {
        descendingResources = descendingResources.slice(0, max);
      }

      const [
        newestResource,
      ] = descendingResources;

      const next = newestResource?.started
        && this.nextLastCreatedAt(newestResource.started);

      const previouslyEmitted = this.getEmittedIds();
      const seen = new Set(previouslyEmitted.map(({ id }) => id));
      const unseenResources = descendingResources.filter(({ id }) => !seen.has(id));

      // `$emit` is async: awaited so state is written once the events are out,
      // not once they are queued. A partial failure costs a repeat, not a skip.
      await Promise.all(unseenResources.map(this.processEvent));

      if (next) {
        this.setLastCreatedAt(next);
      }

      const nextEmitted = previouslyEmitted.concat(unseenResources.map((resource) => {
        const startedMs = this.getStartedMs(resource);
        return {
          id: resource.id,
          startedMs: Number.isNaN(startedMs)
            ? null
            : startedMs,
        };
      }));

      this.setEmittedIds(this.pruneEmittedIds(nextEmitted, next || this.getLastCreatedAt()));
    },
  },
  hooks: {
    async deploy() {
      const resources = await this.app.paginate({
        resourceFn: this.getResourceFn(),
        resourceFnArgs: this.getResourceFnArgs(),
        resourceName: this.getResourceName(),
      });

      await this.processResources(resources, 25);
    },
  },
  async run() {
    const resources = await this.app.paginate({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
      resourceName: this.getResourceName(),
    });

    await this.processResources(resources);
  },
};
