import { ConfigurationError } from "@pipedream/platform";
import app from "../../grist.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
    docId: {
      propDefinition: [
        app,
        "docId",
      ],
    },
    tableId: {
      propDefinition: [
        app,
        "tableId",
        ({ docId }) => ({
          docId,
        }),
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        http,
        docId,
        tableId,
        getEventTypes,
        createWebhooks,
        setWebhookId,
      } = this;

      const response =
        await createWebhooks({
          docId,
          data: {
            webhooks: [
              {
                fields: {
                  url: http.endpoint,
                  enabled: true,
                  eventTypes: getEventTypes(),
                  tableId,
                },
              },
            ],
          },
        });

      setWebhookId(response?.webhooks?.[0]?.id);
    },
    async deactivate() {
      const {
        docId,
        getWebhookId,
        deleteWebhook,
      } = this;

      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook({
          docId,
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
    getEventTypes() {
      throw new ConfigurationError("getEventTypes is not implemented");
    },
    getResourcesFn() {
      throw new ConfigurationError("getResourcesFn is not implemented");
    },
    getResourcesFnArgs() {
      throw new ConfigurationError("getResourcesFnArgs is not implemented");
    },
    processResource(resources) {
      resources.forEach((resource) => {
        this.$emit(resource, this.generateMeta(resource));
      });
    },
    createWebhooks({
      docId, ...args
    } = {}) {
      return this.app.post({
        debug: true,
        path: `/docs/${docId}/webhooks`,
        ...args,
      });
    },
    deleteWebhook({
      docId, webhookId, ...args
    } = {}) {
      return this.app.delete({
        debug: true,
        path: `/docs/${docId}/webhooks/${webhookId}`,
        ...args,
      });
    },
  },
  async run({ body }) {
    this.processResource(body);
  },
};
