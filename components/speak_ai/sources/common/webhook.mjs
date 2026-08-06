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

      setWebhookId(response.data._id);
    },
    async deactivate() {
      const {
        deleteWebhook,
        getWebhookId,
        setWebhookId,
      } = this;

      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook({
          webhookId,
        });
        setWebhookId(null);
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
    getEventId(resource) {
      return resource.deliveryId;
    },
    async getData(resource) {
      return resource;
    },
    async processResource(resource) {
      const data = await this.getData(resource);
      this.$emit({
        ...resource,
        data,
      }, this.generateMeta(resource, data));
    },
    createWebhook({
      data, ...args
    } = {}) {
      return this.app.post({
        path: "/webhook",
        data: {
          description: constants.WEBHOOK_DESCRIPTION,
          ...data,
        },
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        path: `/webhook/${webhookId}`,
        ...args,
      });
    },
  },
  async run({ body }) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      console.log("Skipping delivery: the webhook body is missing or is not an event object.");
      return;
    }
    await this.processResource(body);
  },
};
