import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../kizeo_forms.app.mjs";

export default {
  props: {
    app,
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
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    sortFn() {
      return;
    },
    getResourcesName() {
      throw new ConfigurationError("getResourcesName is not implemented");
    },
    getResourcesFn() {
      throw new ConfigurationError("getResourcesFn is not implemented");
    },
    getResourcesFnArgs() {
      throw new ConfigurationError("getResourcesFnArgs is not implemented");
    },
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    processResources(resources) {
      return Array.from(resources)
        .sort(this.sortFn)
        .forEach(this.processEvent);
    },
  },
  async run() {
    const {
      getResourcesName,
      getResourcesFn,
      getResourcesFnArgs,
      processResources,
    } = this;

    const resourcesFn = getResourcesFn();
    const { [getResourcesName()]: resources } =
      await resourcesFn(getResourcesFnArgs());

    await processResources(resources);
  },
};
