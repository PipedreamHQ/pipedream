import zenler from "../zenler.app.mjs";
import constants from "../common/constants.mjs";
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
    setLastCreatedAt(value) {
      this.db.set(constants.LAST_CREATED_AT, value);
    },
    getLastCreatedAt() {
      return this.db.get(constants.LAST_CREATED_AT);
    },
    setLastUpdatedAt(value) {
      this.db.set(constants.LAST_UPDATED_AT, value);
    },
    getLastUpdatedAt() {
      return this.db.get(constants.LAST_UPDATED_AT);
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
    resourceFilter() {
      throw new Error("resourceFilter is not implemented");
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

      resources
        .filter(this.resourceFilter)
        .forEach(this.processEvent);

      if (lastResource) {
        const { created_at: createdAt } = lastResource;
        const lastCreatedAt = Date.parse(createdAt || new Date());
        this.setLastCreatedAt(lastCreatedAt);
      }
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
