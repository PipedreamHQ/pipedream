import fluxguard from "../../fluxguard.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "fluxguard-new-webhook-event-instant",
  name: "New Webhook Event (Instant)",
  description: "Emit new event when Fluxguard sends a webhook. [See the documentation](https://fluxguard.com/how-to-guides/use-our-api/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    fluxguard,
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
    getEventId(body) {
      return body.page?.id
        ?? body.site?.id
        ?? body.orgId;
    },
  },
  hooks: {
    async activate() {
      const response = await this.fluxguard.createHook({
        url: this.http.endpoint,
      });
      this._setWebhookId(response?.id);
    },
    async deactivate() {
      await this.fluxguard.deleteHook({
        id: this._getWebhookId(),
      });
    },
  },
  async run({ body }) {
    const ts = Date.parse(body.capturedAt);
    const id = this.getEventId(body) ?? ts;

    this.$emit(body, {
      id: `${id}-${ts}`,
      summary: `New Fluxguard webhook event ${id
        ? `(ID: ${id})`
        : ""}`,
      ts,
    });
  },
  sampleEmit,
};

