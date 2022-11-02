import app from "../getresponse.app.mjs";
import constants from "../common/constants.mjs";
import utils from "../common/utils.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the GetResponse API",
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

      resources.forEach(this.processEvent);

      if (lastResource) {
        this.setLastCreatedAt(lastResource.createdOn);
      }
    },
  },
  async run() {
    const resourcesStream = await this.app.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
    });

    await this.processStreamEvents(resourcesStream);
  },
};

