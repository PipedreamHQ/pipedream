import app from "../../shipengine.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  props: {
    app,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const resourcesFn = this.getResourcesFn();
      if (!resourcesFn) {
        return;
      }
      console.log("Retrieving historical events...");
      const stream = this.app.getResourcesStream({
        resourcesFn,
        resourcesFnArgs: this.getResourcesFnArgs(),
        resourcesName: this.getResourcesName(),
      });
      const resources = await utils.streamIterator(stream);

      resources
        .reverse()
        .forEach((resource) =>
          this.$emit(resource, this.generateMeta(resource)));
    },
    async activate() {
      const { webhook_id: webhookId } =
        await this.createWebhook({
          data: {
            url: this.http.endpoint,
            event: this.getEvent(),
          },
        });

      this.setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      if (webhookId) {
        await this.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  methods: {
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    getResourcesFn() {
      return false;
    },
    getResourcesFnArgs() {
      throw new Error("getResourcesFnArgs not implemented");
    },
    getResourcesName() {
      throw new Error("getResourcesName not implemented");
    },
    getEvent() {
      throw new Error("getEvent not implemented");
    },
    processEvents() {
      throw new Error("processEvents not implemented");
    },
    createWebhook(args = {}) {
      return this.app.makeRequest({
        method: "post",
        path: "/environment/webhooks",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.makeRequest({
        method: "delete",
        path: `/environment/webhooks/${webhookId}`,
        ...args,
      });
    },
  },
  async run({ body }) {
    const {
      resource_url: url,
      data,
    } = body;
    const response = data
      ? data
      : await this.app.makeRequest({
        url,
      });
    await this.processEvents(response);
  },
};
