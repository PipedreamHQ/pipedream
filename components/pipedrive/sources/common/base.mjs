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
        intervalSeconds: 60 * 15,
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
      throw new Error("getResourceProperty Not implemented");
    },
    getEventObject() {
      throw new Error("getEventObject Not implemented");
    },
    getEventAction() {
      throw new Error("getEventAction Not implemented");
    },
    getResourceFn() {
      throw new Error("getResourceFn Not implemented");
    },
    getResourceFnArgs() {
      throw new Error("getResourceFnArgs Not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta Not implemented");
    },
    done() {
      throw new Error("done Not implemented");
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
