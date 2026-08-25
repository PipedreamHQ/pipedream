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
// instead. The calls that get read a second time as a result are dropped by
// `dedupe: "unique"`.
//
// The window has to span a whole call and not just the processing that follows
// it, because the filter is on the start time while processing only begins at
// the end. Two hours covers an hour-long call plus the hour that processing is
// generally quoted at; a workspace whose calls run longer, or whose processing
// is slower, can widen it.
const HOUR_MS = 60 * 60 * 1000;
const DEFAULT_PROCESSING_LOOKBACK_HOURS = 2;

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
      description: "How far behind the present to hold the polling cursor. Gong lists calls by the time they started but only returns one once it has finished processing it, so a call whose processing finishes late is skipped for good unless the cursor is still behind it. This window has to cover the length of a call plus the processing that follows it. Raise it if calls are being missed; lower it on a workspace that records more calls in this window than a single poll can read.",
      optional: true,
      min: 1,
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
    nextLastCreatedAt(newest) {
      const previous = this.getLastCreatedAt();
      const newestMs = Date.parse(newest);

      if (Number.isNaN(newestMs)) {
        return previous;
      }

      const lookbackMs = (this.processingLookbackHours
        || DEFAULT_PROCESSING_LOOKBACK_HOURS) * HOUR_MS;
      const held = Math.min(newestMs, Date.now() - lookbackMs);
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
    async processResources(resources, max) {
      let descendingResources = Array.from(resources).reverse();

      if (max) {
        descendingResources = descendingResources.slice(0, max);
      }

      const [
        lastResource,
      ] = descendingResources;

      if (lastResource?.started) {
        const next = this.nextLastCreatedAt(lastResource.started);
        if (next) {
          this.setLastCreatedAt(next);
        }
      }

      descendingResources.forEach(this.processEvent);
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
