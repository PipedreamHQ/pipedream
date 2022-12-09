import constants from "../common/constants.mjs";
import utils from "../common/utils.mjs";
import feedbin from "../feedbin.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    feedbin,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Feedbin API",
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
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getResourceFnArgs() {
      throw new Error("getResourceFnArgs is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    async processStreamEvents(stream) {
      const resources = await utils.streamIterator(stream);

      const [
        lastResource,
      ] = resources;

      if (lastResource) {
        this.setLastCreatedAt(lastResource.created_at);
      }

      resources.forEach(this.processEvent);
    },
  },
  async run() {
    const resourcesStream = await this.feedbin.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: await this.getResourceFnArgs(),
    });

    await this.processStreamEvents(resourcesStream);
  },
};
