import zenler from "../zenler.app.mjs";
import utils from "../common/utils.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    zenler,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Zenler API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getResourceFnArgs() {
      return {};
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    resourceFilter() {
      return true;
    },
    reverseResources(resources = []) {
      return resources.reverse();
    },
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    async processStream(stream) {
      const resources = await utils.streamIterator(stream);
      this.reverseResources(resources)
        .filter(this.resourceFilter)
        .forEach(this.processEvent);
    },
  },
  async run() {
    const stream = this.zenler.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
    });

    await this.processStream(stream);
  },
};
