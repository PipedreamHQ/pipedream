import zenler from "../zenler.app.mjs";
import utils from "../common/utils.mjs";

export default {
  props: {
    zenler,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Zenler API",
      default: {
        intervalSeconds: 60 * 15,
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
    async processStreamEvents(stream) {
      const resources = await utils.streamIterator(stream);
      this.reverseResources(resources)
        .filter(this.resourceFilter)
        .forEach(this.processEvent);
    },
  },
  async run() {
    const resourcesStream =
      await this.zenler.getResourcesStream({
        resourceFn: this.getResourceFn(),
        resourceFnArgs: this.getResourceFnArgs(),
      });

    await this.processStreamEvents(resourcesStream);
  },
};
