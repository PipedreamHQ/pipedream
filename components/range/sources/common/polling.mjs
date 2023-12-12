import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../range.app.mjs";
import utils from "../../common/utils.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Range API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    listUpdates(args = {}) {
      return this.app.makeRequest({
        path: "/updates",
        ...args,
      });
    },
    setLastPublishedAt(value) {
      this.db.set(constants.LAST_PUBLISHED_AT, value);
    },
    getLastPublishedAt() {
      return this.db.get(constants.LAST_PUBLISHED_AT);
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getResourcesFn() {
      throw new ConfigurationError("getResourcesFn not implemented");
    },
    getResourcesFnArgs() {
      throw new ConfigurationError("getResourcesFnArgs not implemented");
    },
    getResourcesName() {
      throw new ConfigurationError("getResourcesName not implemented");
    },
    async processEvents() {
      console.log("Retrieving historical events...");
      const stream = this.app.getResourcesStream({
        resourcesFn: this.getResourcesFn(),
        resourcesFnArgs: this.getResourcesFnArgs(),
        resourcesName: this.getResourcesName(),
      });

      const resources = await utils.streamIterator(stream);

      const [
        lastResource,
      ] = resources;

      if (lastResource?.published_at) {
        this.setLastPublishedAt(lastResource.published_at);
      }

      resources
        .reverse()
        .forEach((resource) =>
          this.$emit(resource, this.generateMeta(resource)));
    },
  },
  async run() {
    await this.processEvents();
  },
};
