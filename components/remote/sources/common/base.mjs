import remote from "../../remote.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    remote,
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  hooks: {
    async activate() {
      const { data: { webhook_callback: { id } } } = await this.remote.createHook({
        data: {
          url: this.http.endpoint,
          subscribed_events: this.getEvent(),
        },
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.remote.deleteHook(webhookId);
    },
  },
  async run({ body }) {
    const ts = Date.now();
    this.$emit(body, this.generateMeta({
      body,
      ts,
    }));
  },
};
