import mailjetApp from "../../mailjet.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    mailjetApp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the MailJet API",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  hooks: {
    async deploy() {
      const stream =
        await this.mailjetApp.getResourcesStream({
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
    getResourceFn() {
      throw new Error("getResourceFn not implemented");
    },
    getResourceFnArgs() {
      return {
        params: {
          Limit: 10,
          Sort: `${this.getResourceProperty()} DESC`,
        },
      };
    },
    getResourceProperty() {
      throw new Error("getResourceProperty not implemented");
    },
    getTimestamp() {
      throw new Error("getTimestamp not implemented");
    },
    getModelName() {
      throw new Error("getModelName not implemented");
    },
    getAction() {
      throw new Error("getAction not implemented");
    },
    generateMeta(resource) {
      return {
        id: resource.ID,
        summary: `${this.getModelName()} ${resource.Email} was ${this.getAction()}`,
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
      const resources = [];

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
      await this.mailjetApp.getResourcesStream({
        resourceFn: this.getResourceFn(),
        resourceFnArgs: this.getResourceFnArgs(),
        lastResourceProperty: this.getLastResourceProperty(),
        done: this.done,
      });

    await this.processStreamEvents(stream);
  },
};
