import { ConfigurationError } from "@pipedream/platform";
import app from "../../content_snare.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const {
        http,
        createWebhook,
        getSubscriptions,
      } = this;

      const response =
        await createWebhook({
          data: {
            url: http.endpoint,
            subscriptions: getSubscriptions(),
            enabled: true,
          },
        });

      this.setWebhookId(response.id);
    },
    async deactivate() {
      const {
        getWebhookId,
        deleteWebhook,
      } = this;

      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook({
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
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getSubscriptions() {
      throw new ConfigurationError("getSubscriptions is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook(args = {}) {
      return this.app.post({
        debug: true,
        path: "/webhooks",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        debug: true,
        path: `/webhooks/${webhookId}`,
        ...args,
      });
    },
  },
  run({ body }) {
    this.processResource(body);
  },
};
