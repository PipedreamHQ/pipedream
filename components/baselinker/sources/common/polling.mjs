import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import common from "./base.mjs";
import constants from "../../common/constants.mjs";
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
    setLastLogId(value) {
      this.db.set(constants.LAST_LOG_ID, value);
    },
    getLastLogId() {
      return this.db.get(constants.LAST_LOG_ID);
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
    async getResourceByEvent() {
      throw new ConfigurationError("getResourceByEvent is not implemented");
    },
    processResource(resource) {
      if (!resource) {
        return;
      }
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    async processStreamEvents(resourcesStream) {
      const events = await utils.streamIterator(resourcesStream);

      const resources = await Promise.all(events.map(this.getResourceByEvent));

      const [
        lastEvent,
      ] = Array.from(events).reverse();

      if (lastEvent?.log_id) {
        this.setLastLogId(lastEvent.log_id);
      }

      resources.forEach(this.processResource);
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
