import app from "../../shipengine.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
  },
  methods: {
    setLastCreatedAtStart(value) {
      this.db.set(constants.LAST_CREATED_AT_START, value);
    },
    getLastCreatedAtStart() {
      return this.db.get(constants.LAST_CREATED_AT_START);
    },
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
};
