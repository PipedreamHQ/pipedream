import { ConfigurationError } from "@pipedream/platform";
import app from "../../xola.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        userId,
        getEventName,
        http: { endpoint: url },
        createWebhook,
      } = this;

      const { id } = await createWebhook({
        userId,
        data: {
          url,
          eventName: getEventName(),
        },
      });
      this.setWebhookId(id);
    },
    async deactivate() {
      const {
        userId,
        getWebhookId,
        deleteWebhook,
      } = this;
      const webhookId = getWebhookId();
      if (webhookId) {
        await deleteWebhook({
          webhookId,
          userId,
        });
      }
    },
  },
  methods: {
    setWebhookId(value) {
      this.db.set("webhookId", value);
    },
    getWebhookId() {
      return this.db.get("webhookId");
    },
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    createWebhook({
      userId, ...args
    }) {
      return this.app.post({
        path: `/users/${userId}/hooks`,
        ...args,
      });
    },
    deleteWebhook({
      userId, webhookId, ...args
    }) {
      return this.app.delete({
        path: `/users/${userId}/hooks/${webhookId}`,
        ...args,
      });
    },
  },
  async run({ body }) {
    this.$emit(body, this.generateMeta(body));
  },
};
