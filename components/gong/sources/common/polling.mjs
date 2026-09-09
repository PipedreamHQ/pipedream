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
// instead. The calls that get read a second time as a result are filtered out
// against a ledger of ids already emitted from inside the window. The platform's
// `dedupe: "unique"` is not sufficient on its own here: it remembers only the
// last 100 ids, which a busy workspace overruns within a single window.
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

// Kept here rather than in `common/constants.mjs` for the same reason as the
// values above: that file reaches every action in this app through
// `gong.app.mjs`, so touching it costs a version bump on five components this
// change does not affect.
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
    setEmittedIds(value) {
      this.db.set(EMITTED_IDS, value);
    },
    getEmittedIds() {
      return this.db.get(EMITTED_IDS) || [];
    },
    // Only calls that the next poll can actually read again are worth
    // remembering, so the ledger is pruned to the window the cursor reopens.
    // A null `startedMs` marks a call the date filter cannot exclude either,
    // which therefore comes back on every poll and has to be kept for good.
    // The cap is a backstop for a workspace busy enough to fill the window with
    // more calls than a single poll returns. Gong hands back the lowest call ids
    // first and stops at the same cap, so keeping the lowest ids keeps precisely
    // the entries the next poll reads back. That mirrors observed ordering
    // rather than a documented guarantee; if it ever changes, the cost is a
    // repeat event, which is why `dedupe: "unique"` stays on as a backstop.
    pruneEmittedIds(entries, cursor) {
      const cursorMs = Date.parse(cursor);

      // A call whose `started` will not parse is not excluded by the date
      // filter either, so it comes back on every poll and has to be kept for
      // good. These are pathological and rare, so they get their own budget
      // rather than consuming a slot a real call needs - but a budget all the
      // same, so a workspace producing them steadily cannot grow this without
      // bound. Newest ids win, since the oldest are likeliest to be gone.
      const unfilterable = entries
        .filter(({ startedMs }) => !startedMs)
        .sort((a, b) => String(b.id).localeCompare(String(a.id)))
        .slice(0, constants.DEFAULT_MAX);
      const dated = entries.filter(({ startedMs }) => startedMs);

      const withinWindow = Number.isNaN(cursorMs)
        ? dated
        : dated.filter(({ startedMs }) => startedMs >= cursorMs);

      // Gong hands back the lowest call ids first and stops at the same cap, so
      // keeping the lowest ids keeps precisely the entries the next poll reads
      // back. That mirrors observed ordering rather than a documented
      // guarantee; if it ever changes the cost is a repeat event, which is why
      // `dedupe: "unique"` stays on as a backstop.
      const capped = withinWindow
        .sort((a, b) => String(a.id).localeCompare(String(b.id)))
        .slice(0, constants.DEFAULT_MAX);

      return unfilterable.concat(capped);
    },
    nextLastCreatedAt(newest) {
      const previous = this.getLastCreatedAt();
      const newestMs = Date.parse(newest);

      if (Number.isNaN(newestMs)) {
        return previous;
      }

      // The schema bounds this prop, but a programmatic caller can still pass a
      // value large enough to push the cursor outside the range Date accepts,
      // which would throw below and abort the poll. Clamp rather than trust it.
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
      this.$emit(resource, meta);
    },
    getStartedMs(resource) {
      return Date.parse(resource?.started);
    },
    async processResources(resources, max) {
      // Gong returns calls ordered by id, not by start time, so the last
      // element is an arbitrary call rather than the newest one. Order the
      // batch explicitly: the cursor below is derived from the head of this
      // list, and `deploy` slices it to emit the most recent calls.
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

      unseenResources.forEach(this.processEvent);

      // State is written only once the events are out: a partial failure should
      // cost a repeat on the next poll, never a silently skipped call.
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

      this.processResources(resources, 25);
    },
  },
  async run() {
    const resources = await this.app.paginate({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
      resourceName: this.getResourceName(),
    });

    this.processResources(resources);
  },
};
