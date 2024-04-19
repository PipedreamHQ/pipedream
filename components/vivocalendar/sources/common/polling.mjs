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
      label: "Polling Schedule",
      description: "How often to poll the API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    ...common.methods,
    getResourceName() {
      throw new ConfigurationError("getResourceName is not implemented");
    },
    getResourcesFn() {
      throw new ConfigurationError("getResourcesFn is not implemented");
    },
    getResourcesFnArgs() {
      throw new ConfigurationError("getResourcesFnArgs is not implemented");
    },
    processResource(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    processResources(resources) {
      Array.from(resources)
        .reverse()
        .forEach(this.processResource);
    },
  },
  async run() {
    const {
      getResourcesFn,
      getResourcesFnArgs,
      getResourceName,
      processResources,
    } = this;

    const resourcesFn = getResourcesFn();
    const response = await resourcesFn(getResourcesFnArgs());
    const resourceName = getResourceName();

    const keys = resourceName.split(".");
    const resources = keys.reduce((acc, key) => acc[key], response);

    processResources(resources);
  },
};
