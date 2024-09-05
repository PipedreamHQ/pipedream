import { ConfigurationError } from "@pipedream/platform";
import app from "../../actitime.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const {
        http: { endpoint: targetUrl },
        createWebhook,
        getEventName,
        setWebhookId,
        getFilter,
      } = this;

      const response =
        await createWebhook({
          data: {
            target_url: targetUrl,
            event: getEventName(),
            filter: getFilter(),
            enabled: true,
          },
        });

      setWebhookId(response.id);
    },
    async deactivate() {
      const {
        deleteWebhook,
        getWebhookId,
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
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    setWebhookId(value) {
      this.db.set(constants.WEBHOOK_ID, value);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
    },
    getFilter() {
      return;
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook(args = {}) {
      return this.app.post({
        debug: true,
        path: "/hooks",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        debug: true,
        path: `/hooks/${webhookId}`,
        ...args,
      });
    },
  },
  async run({ body }) {
    const {
      http,
      processResource,
    } = this;

    Array.isArray(body)
      ? body.forEach(processResource)
      : processResource(body);

    http.respond({
      status: 200,
    });
  },
};
