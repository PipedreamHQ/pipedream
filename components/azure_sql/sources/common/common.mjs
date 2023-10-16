import app from "../../azure_sql.app.mjs";
import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getLastTs() {
      return this.db.get("lastTs") || 0;
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
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    processEvent(resource) {
      const {
        generateMeta,
        $emit,
      } = this;

      return $emit(resource, generateMeta(resource));
    },
    processResources(resources) {
      Array.from(resources).forEach(this.processEvent);
    },
    async listResults() {
      const {
        app,
        getResourceFn,
        getResourceFnArgs,
        getResourceName,
        processResources,
      } = this;

      const resources = await app.paginate({
        resourceFn: getResourceFn(),
        resourceFnArgs: getResourceFnArgs(),
        resourceName: getResourceName(),
      });

      processResources(resources);
    },
  },
  run() {
    return this.listResults();
  },
};
