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
    filterResources(resources) {
      return resources;
    },
    async processStreamEvents(resources) {
      const relevantResources = this.filterResources(resources);
      relevantResources.reverse().forEach(this.processEvent);
      console.log(`Fetched ${resources.length} total resources`);
      console.log(`Emitting ${relevantResources.length} resources`);
      console.log(`Filtered out ${resources.length - relevantResources.length} unchanged`);
    },
  },
  async run() {
    const resources = await this.app.paginate({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
      resourceName: this.getResourceName(),
    });

    await this.processStreamEvents(resources);
  },
};
