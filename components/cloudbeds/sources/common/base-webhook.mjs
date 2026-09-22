import cloudbeds from "../../cloudbeds.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    cloudbeds,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const { data: { subscriptionID: id } } = await this.cloudbeds.createWebhook({
        data: {
          endpointUrl: this.http.endpoint,
          object: this.getObject(),
          action: this.getAction(),
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      this.setWebhookId(id);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      if (webhookId) {
        await this.cloudbeds.deleteWebhook({
          params: {
            subscriptionID: webhookId,
          },
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
    isRelevant() {
      return true;
    },
    getObject() {
      throw new ConfigurationError("getObject is not implemented");
    },
    getAction() {
      throw new ConfigurationError("getAction is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });
    if (!this.isRelevant(body)) {
      return;
    }
    this.$emit(body, this.generateMeta(body));
  },
};
