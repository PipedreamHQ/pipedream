import signPlus from "../../sign_plus.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    signPlus,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.signPlus.createWebhook({
        data: {
          event: this.getEvent(),
          target: this.http.endpoint,
          name: this.name,
        },
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.signPlus.deleteWebhook({
        webhookId,
      });
    },
  },
  methods: {
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    getEvent() {
      throw new ConfigurationError("getEvent is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    const { body } = event;
    if (!body) {
      return;
    }

    this.$emit(event, this.generateMeta(event));
  },
};
