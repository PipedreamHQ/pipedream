import { ConfigurationError } from "@pipedream/platform";
import app from "../../tableau.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        createWebhook,
        siteId,
        getWebhookName,
        getEventName,
        http,
        setWebhookId,
      } = this;

      const { webhook: { id: webhookId } } =
        await createWebhook({
          siteId,
          data: {
            webhook: {
              "name": getWebhookName(),
              "event": getEventName(),
              "isEnabled": true,
              "webhook-destination": {
                "webhook-destination-http": {
                  "method": "POST",
                  "url": http.endpoint,
                },
              },
            },
          },
        });

      setWebhookId(webhookId);
    },
    async deactivate() {
      const {
        getWebhookId,
        siteId,
        deleteWebhook,
      } = this;

      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook({
          siteId,
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
    getWebhookName() {
      throw new ConfigurationError("getWebhookName is not implemented");
    },
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook({
      siteId, ...args
    } = {}) {
      return this.app.post({
        debug: true,
        path: `/sites/${siteId}/webhooks`,
        ...args,
      });
    },
    deleteWebhook({
      siteId, webhookId, ...args
    } = {}) {
      return this.app.delete({
        debug: true,
        path: `/sites/${siteId}/webhooks/${webhookId}`,
        ...args,
      });
    },
  },
  run({ body }) {
    this.processResource(body);
  },
};
