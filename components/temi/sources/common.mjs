import app from "../temi.app.mjs";
import constants from "../common/constants.mjs";
import utils from "../common/utils.mjs";

export default {
  props: {
    app,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const stream =
        await this.app.getResourcesStream({
          resourceFn: this.getResourceFn(),
        });

      await this.processStreamEvents(stream);
    },
  },
  methods: {
    setCreatedOn(value) {
      this.db.set(constants.CREATED_ON, value);
    },
    getCreatedOn() {
      return this.db.get(constants.CREATED_ON);
    },
    getResourceFn() {
      return this.app.getJobs;
    },
    getStatus() {
      throw new Error("getStatus not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta not implemented");
    },
    getFieldName() {
      throw new Error("getFieldName not implemented");
    },
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    async processStreamEvents(stream) {
      const resources = await utils.streamIterator(stream);

      if (resources.length === 0) {
        console.log("No new events detected. Skipping...");
        return;
      }

      const resourcesFiltered = resources
        .filter(({ status }) => status === this.getStatus());

      const [
        lastResource,
      ] = resourcesFiltered;

      if (lastResource) {
        this.setCreatedOn(lastResource.created_on);
      }

      resourcesFiltered.reverse().forEach(this.processEvent);
    },
  },
  async run() {
    const stream =
      await this.app.getResourcesStream({
        resourceFn: this.getResourceFn(),
        lastDateTime: this.getCreatedOn(),
      });

    await this.processStreamEvents(stream);
  },
};
