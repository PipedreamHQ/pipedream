import app from "../../pipedrive.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      const stream =
        await this.app.getResourcesStream({
          resourceFn: this.getResourceFn(),
          resourceFnArgs: this.getResourceFnArgs(),
          max: constants.DEFAULT_MAX_ITEMS,
        });

      await this.processStreamEvents(stream);
    },
    // async activate() {
    //   const { data: { id: webhookId } } =
    //     await this.app.addWebhook({
    //       subscription_url: this.http.endpoint,
    //       event_action: this.getEventAction(),
    //       event_object: this.getEventObject(),
    //     });
    //   this.setWebhookId(webhookId);
    // },
    // async deactivate() {
    //   await this.app.deleteWebhook(this.getWebhookId());
    // },
  },
  methods: {
    setWebhookId(webhookId) {
      this.db.set(constants.WEBHOOK_ID, webhookId);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    getLastAddTime() {
      return this.db.get(constants.LAST_ADD_TIME);
    },
    setLastAddTime(value) {
      this.db.set(constants.LAST_ADD_TIME, value);
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
    processEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    async processStreamEvents(stream) {
      const resources = utils.streamIterator(stream);

      if (resources.length === 0) {
        console.log("No new events detected. Skipping...");
        return;
      }

      const [
        lastResource,
      ] = resources;

      resources.reverse().forEach(this.processEvent);

      if (lastResource) {
        this.setLastAddTime(lastResource[this.getResourceProperty()]);
      }
    },
  },
  async run({ body }) {
    console.log("body", JSON.stringify(body, null, 2));
    // const stream =
    //   await this.app.getResourcesStream({
    //     resourceFn: this.getResourceFn(),
    //     resourceFnArgs: this.getResourceFnArgs(),
    //   });

    // await this.processStreamEvents(stream);
  },
};
