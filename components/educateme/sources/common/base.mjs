import educateme from "../../educateme.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    educateme,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async getResources() {
      throw new ConfigurationError("getResources method must be implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta method must be implemented");
    },
  },
  async run() {
    const resources = await this.getResources();
    for (const resource of resources) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    }
  },
};
