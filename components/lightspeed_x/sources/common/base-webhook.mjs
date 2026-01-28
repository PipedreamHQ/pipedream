import lightspeedX from "../../lightspeed_x.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    lightspeedX,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const { data: { id } } = await this.lightspeedX.createWebhook({
        data: {
          active: true,
          type: this.getEventType(),
          url: this.http.endpoint,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      if (webhookId) {
        await this.lightspeedX.deleteWebhook(webhookId);
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("webhookId");
    },
    _setHookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    if (!body) {
      return;
    }

    const payload = JSON.parse(body.payload);
    const meta = this.generateMeta(payload);
    this.$emit(payload, meta);
  },
};
