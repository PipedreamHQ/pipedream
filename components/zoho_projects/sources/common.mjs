import constants from "../common/constants.mjs";
import utils from "../common/utils.mjs";
import zohoProjects from "../zoho_projects.app.mjs";

export default {
  props: {
    zohoProjects,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Zoho Projects API",
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
    getResourceName() {
      throw new Error("getResourceName is not implemented");
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
        this.setLastCreatedAt(lastResource.created_time_long || lastResource.created_date_long);
      }
    },
  },
  async run() {
    const resourcesStream = await this.zohoProjects.getResourcesStream({
      resourceName: this.getResourceName(),
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
    });

    await this.processStreamEvents(resourcesStream);
  },
};
