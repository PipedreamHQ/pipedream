import app from "../../heyy.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "heyy-new-incoming-message-instant",
  name: "New Incoming Message",
  description: "Emit new event when a business gets a new incoming message. [See the documentation](https://documenter.getpostman.com/view/27408936/2sA2r3a6DW#eda04a28-4c5b-4709-a3f4-204dba6bcc18).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
    channelId: {
      propDefinition: [
        app,
        "channelId",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        createWebhook,
        http: { endpoint: url },
        channelId,
        setWebhookId,
      } = this;
      const response =
        await createWebhook({
          data: {
            url,
            type: "WHATSAPP_MESSAGE_RECEIVED",
            channelId,
          },
        });

      setWebhookId(response.data.id);
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
    generateMeta({ data: { whatsappMessage: resource } }) {
      return {
        id: resource.metaMessageId,
        summary: `New Incomming Message ${resource.metaMessageId}`,
        ts: parseInt(resource.timestamp),
      };
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createWebhook(args = {}) {
      return this.app.post({
        debug: true,
        path: "/api_webhooks",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.app.delete({
        debug: true,
        path: `/api_webhooks/${webhookId}`,
        ...args,
      });
    },
  },
  async run({ body }) {
    this.processResource(body);
  },
};
