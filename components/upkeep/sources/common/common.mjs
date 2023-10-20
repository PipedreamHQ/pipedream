import app from "../../upkeep.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  props: {
    app,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getHookID() {
      return this.db.get("hookId");
    },
    _setHookID(hookID) {
      this.db.set("hookId", hookID);
    },
    getEvents() {
      throw new Error("getEvents is not implemented!");
    },
    getTitle() {
      throw new Error("getTitle is not implemented!");
    },
    getSummary() {
      throw new Error("getSummary is not implemented!");
    },
    getTime() {
      throw new Error("getTime is not implemented!");
    },
    getHistoricalEventsFn() {
      return false;
    },
    processMeta(item) {
      return {
        summary: this.getSummary(item),
        id: item?.id,
        ts: this.getTime(item),
      };
    },
  },
  hooks: {
    async activate() {
      const { webhookId } = await this.app.createWebhook({
        title: this.getTitle(),
        endpoint: this.http.endpoint,
        events: this.getEvents(),
      });
      this._setHookID(webhookId);
      console.log(`Created webhook. (Hook ID: ${webhookId}, endpoint: ${this.http.endpoint})`);
    },
    async deploy() {
      const resourceFn = this.getHistoricalEventsFn();
      if (!resourceFn)
        return;
      const resourcesStream = utils.getResourcesStream({
        resourceFn,
        resourceLimit: 10,
      });
      for await (const item of resourcesStream) {
        this.$emit(
          item,
          this.processMeta(item),
        );
      }
    },
    async deactivate() {
      await this.app.deleteWebhook({
        webhookId: this._getHookID(),
      });
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });
    this.$emit(
      event,
      this.processMeta(event.body),
    );
  },
};
