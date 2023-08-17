import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import common from "./base.mjs";
import utils from "../../common/utils.mjs";

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
    async processStreamEvents(resourcesStream) {
      const resources = await utils.streamIterator(resourcesStream);
      resources.reverse().forEach(this.processEvent);
    },
  },
  async run() {
    const resourcesStream = this.app.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
      resourceName: this.getResourceName(),
    });

    await this.processStreamEvents(resourcesStream);
  },
};
