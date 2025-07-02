import asters from "../../asters.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    asters,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getResourceFn() {
      throw new ConfigurationError("getResourceFn must be implemented");
    },
    getArgs() {
      throw new ConfigurationError("getArgs must be implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta must be implemented");
    },
    processResource() {
      throw new ConfigurationError("processResource must be implemented");
    },
  },
  async run() {
    const resources = await this.asters.getPaginatedResources({
      fn: this.getResourceFn(),
      args: this.getArgs(),
    });

    for (const resource of resources) {
      await this.processResource(resource);
    }
  },
};
