import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import common from "./base.mjs";
import constants from "../../common/constants.mjs";

// Gong makes a call queryable only once it has finished processing it, which
// can be well after the time the call started, and `fromDateTime` filters on
// that start time server-side. So a cursor that jumps straight to the newest
// start time it has seen hides every call still being processed behind it, and
// hides it permanently: no later poll ever asks for that range again. Holding
// the cursor this far behind the present keeps those calls inside the next
// poll's window instead. The calls that get read a second time as a result are
// dropped by `dedupe: "unique"`.
const PROCESSING_LAG_MS = 60 * 60 * 1000;

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

      const held = Math.min(newestMs, Date.now() - PROCESSING_LAG_MS);
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
