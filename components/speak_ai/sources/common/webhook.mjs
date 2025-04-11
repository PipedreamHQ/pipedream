import { ConfigurationError } from "@pipedream/platform";
import app from "../../speak_ai.app.mjs";
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
        http: { endpoint: callbackUrl },
        createWebhook,
        getEvents,
        setWebhookId,
      } = this;

      const response =
        await createWebhook({
          data: {
            callbackUrl,
            events: getEvents(),
          },
        });

      setWebhookId(response.data.webhookId);
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
    getEvents() {
      throw new ConfigurationError("getEvents is not implemented");
    },
    async getData(resource) {
      return resource;
    },
    async processResource(resource) {
      const data = await this.getData(resource);
      this.$emit({
        ...resource,
        data,
      }, this.generateMeta(resource));
    },
    createWebhook(args = {}) {
      return this.app.post({
        debug: true,
        path: "/webhook",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        debug: true,
        path: `/webhook/${webhookId}`,
        ...args,
      });
    },
  },
  async run({ body }) {
    await this.processResource(body);
  },
};
