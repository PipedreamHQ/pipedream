import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../trust.app.mjs";

export default {
  props: {
    app,
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
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    sortFn() {
      return;
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
    async processResources(resources) {
      const {
        sortFn,
        processResource,
      } = this;

      return Array.from(resources)
        .sort(sortFn)
        .forEach(processResource);
    },
  },
  async run() {
    const {
      getResourcesFn,
      getResourcesFnArgs,
      processResources,
    } = this;

    const resourcesFn = getResourcesFn();
    const resources = await resourcesFn(getResourcesFnArgs());

    processResources(resources);
  },
};
