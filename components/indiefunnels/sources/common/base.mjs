import crypto from "crypto";
import indiefunnels from "../../indiefunnels.app.mjs";

export default {
  props: {
    indiefunnels,
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
  },
  hooks: {
    async activate() {
      const response = await this.indiefunnels.createHook({
        data: {
          target: this.http.endpoint,
          secret: crypto.randomUUID(),
          events: this.getEvent(),
        },
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.indiefunnels.deleteHook(webhookId);
    },
  },
  async run({ body }) {
    const ts = body.created || Date.now();
    this.$emit(body, {
      id: `${body.id}-${ts}`,
      summary: this.getSummary(body),
      ts,
    });
  },
};
