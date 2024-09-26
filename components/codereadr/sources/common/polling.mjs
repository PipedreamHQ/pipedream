import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import common from "./base.mjs";
import constants from "../../common/constants.mjs";

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
    setLastTimestamp(value) {
      this.db.set(constants.LAST_TIMESTAMP, value);
    },
    getLastTimestamp() {
      return this.db.get(constants.LAST_TIMESTAMP);
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
    async processResources(resources) {
      const [
        lastResource,
      ] = resources;

      if (lastResource?.timestamp) {
        this.setLastTimestamp(lastResource.timestamp);
      }

      Array.from(resources)
        .reverse()
        .forEach(this.processEvent);
    },
  },
  async run() {
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
};
