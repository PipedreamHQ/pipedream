import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import zohoDesk from "../../zoho_desk.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    zohoDesk,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Zoho Desk API",
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

      const filteredResources = resources.filter(this.resourceFilter);
      for (const resource of filteredResources) {
        await this.processEvent(resource);
      }

      if (lastResource) {
        const {
          commentedTime,
          createdTime,
          modifiedTime,
        } = lastResource;
        const lastCreatedAt =
          Date.parse(
            commentedTime
            || createdTime
            || new Date(),
          );
        const lastUpdatedAt =
          Date.parse(
            modifiedTime
            || new Date(),
          );
        this.setLastCreatedAt(lastCreatedAt);
        this.setLastUpdatedAt(lastUpdatedAt);
      }
    },
  },
  async run() {
    const resourcesStream = await this.zohoDesk.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
    });

    await this.processStreamEvents(resourcesStream);
  },
};
