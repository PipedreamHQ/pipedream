import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../proofly.app.mjs";

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
  },
  async run() {
    const {
      getResourcesFn,
      getResourceName,
      getResourcesFnArgs,
      processResource,
    } = this;

    const resourcesFn = getResourcesFn();
    const { [getResourceName()]: resources } =
      await resourcesFn(getResourcesFnArgs());

    Array.from(resources)
      .reverse()
      .forEach(processResource);
  },
};
