import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import common from "./base.mjs";

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
    setCurrentRow(key, value) {
      this.db.set(key, value);
    },
    getCurrentRow(key) {
      return this.db.get(key);
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
    processEvent({
      pdId, ...resource
    } = {}) {
      const {
        generateMeta,
        setCurrentRow,
        getCurrentRow,
        $emit,
      } = this;

      if (!pdId) {
        return $emit(resource, generateMeta(resource));
      }

      const currentRow = JSON.stringify(resource, null, 2);
      const key = `id-${pdId}`;
      const row = getCurrentRow(key);

      if (row && row === currentRow) {
        // Don't emit if the row hasn't changed
        return;
      }

      $emit(resource, generateMeta(resource));
      setCurrentRow(key, currentRow);
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
