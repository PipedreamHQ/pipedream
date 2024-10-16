import { ConfigurationError } from "@pipedream/platform";
import app from "../../americommerce.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    storeId: {
      optional: false,
      propDefinition: [
        app,
        "storeId",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        createWebhook,
        setWebhookId,
        http: { endpoint: url },
        getEventType,
        storeId,
      } = this;
      const response =
        await createWebhook({
          data: {
            url,
            event_type: getEventType(),
            store_id: storeId,
          },
        });

      setWebhookId(response.id);
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
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    getEventType() {
      throw new ConfigurationError("getEventType is not implemented");
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
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    this.processResource(body);
  },
};
