import app from "../../prodpad.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  props: {
    app,
    db: "$.service.db",
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
    setLastCreatedAt(value) {
      this.db.set(constants.LAST_CREATED_AT, value);
    },
    getLastCreatedAt() {
      return this.db.get(constants.LAST_CREATED_AT);
    },
    getRequestResourcesFn() {
      throw new ConfigurationError("getRequestResourcesFn is not implemented");
    },
    getRequestResourcesArgs() {
      return {};
    },
    getResourceName() {},
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    async processEvents(resources) {
      const [
        lastResource,
      ] = resources;

      if (lastResource?.created_at) {
        this.setLastCreatedAt(lastResource.created_at);
      }

      resources.reverse().forEach(this.processEvent);
    },
  },
  async run() {
    const stream = this.app.getResourcesStream({
      requestResourcesFn: this.getRequestResourcesFn(),
      requestResourcesArgs: this.getRequestResourcesArgs(),
      resourceName: this.getResourceName(),
      lastCreatedAt: this.getLastCreatedAt(),
    });
    const resources = await utils.streamIterator(stream);
    await this.processEvents(resources);
  },
};
