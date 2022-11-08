import pipedriveApp from "../../pipedrive.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    pipedriveApp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Pipedrive API",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      const stream =
        await this.pipedriveApp.getResourcesStream({
          resourceFn: this.getResourceFn(),
          resourceFnArgs: this.getResourceFnArgs(),
          max: constants.DEFAULT_MAX_ITEMS,
        });

      await this.processStreamEvents(stream);
    },
  },
  methods: {
    getLastResourceProperty() {
      return this.db.get(constants.LAST_RESOURCE_PROPERTY);
    },
    setLastResourceProperty(value) {
      this.db.set(constants.LAST_RESOURCE_PROPERTY, value);
    },
    getResourceProperty() {
      throw new Error("getResourceProperty not implemented");
    },
    getEventObject() {
      throw new Error("getEventObject not implemented");
    },
    getEventAction() {
      throw new Error("getEventAction not implemented");
    },
    getResourceFn() {
      throw new Error("getResourceFn not implemented");
    },
    getResourceFnArgs() {
      throw new Error("getResourceFnArgs not implemented");
    },
    getTimestamp() {
      throw new Error("getTimestamp not implemented");
    },
    getMetaId(resource) {
      return resource.id;
    },
    generateMeta(resource) {
      return {
        id: this.getMetaId(resource),
        summary: `${this.getEventObject()} ${resource.id} was ${this.getEventAction()}`,
        ts: this.getTimestamp(resource),
      };
    },
    done({
      resource, lastResourceProperty,
    }) {
      const property = this.getResourceProperty();
      return lastResourceProperty === String(resource[property]);
    },
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    async processStreamEvents(stream) {
      let resources = [];
      for await (const resource of stream) {
        resources.push(resource);
      }

      if (resources.length === 0) {
        console.log("No new events detected. Skipping...");
        return;
      }

      resources.reverse().forEach(this.processEvent);

      const [
        lastResource,
      ] = resources.slice(-1);

      if (lastResource) {
        this.setLastResourceProperty(lastResource[this.getResourceProperty()]);
      }
    },
  },
  async run() {
    const stream =
      await this.pipedriveApp.getResourcesStream({
        resourceFn: this.getResourceFn(),
        resourceFnArgs: this.getResourceFnArgs(),
        lastResourceProperty: this.getLastResourceProperty(),
        done: this.done,
      });

    await this.processStreamEvents(stream);
  },
};
