import constants from "../constants.mjs";
import dear from "../dear.app.mjs";

export default {
  props: {
    dear,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.dear.createWebhook({
        data: this.setupWebhookData(this.http.endpoint),
      });
      console.log("webhook", webhook);

      const { ID: webhookId } = webhook;
      this.setWebhookId(webhookId);
    },
    async deactivate() {
      await this.dear.deleteWebhook({
        params: {
          ID: this.getWebhookId(),
        },
      });
    },
  },
  methods: {
    setWebhookId(webhookId) {
      this.db.set(constants.WEBHOOK_ID, webhookId);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    getWebhookType() {
      throw new Error("getWebhookType Not implemented");
    },
    setupWebhookData(endpoint) {
      return {
        Type: this.getWebhookType(),
        IsActive: true,
        ExternalURL: endpoint,
        ExternalAuthorizationType: "noauth",
      };
    },
  },
};
