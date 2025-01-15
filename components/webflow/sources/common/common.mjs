import app from "../../webflow.app.mjs";
import { v4 as uuid } from "uuid";
import constants from "../../common/constants.mjs";

export default {
  dedupe: "unique",
  props: {
    app,
    siteId: {
      propDefinition: [
        app,
        "sites",
      ],
    },
    db: "$.service.db",
    http: "$.interface.http",
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getWebhookTriggerType() {
      throw new Error("getWebhookTriggerType is not implemented");
    },
    generateMeta(data) {
      return {
        id: data.id || uuid(),
        summary: "New event",
        ts: Date.now(),
      };
    },
    processEvent(event) {
      const { body: { payload } } = event;
      const meta = this.generateMeta(payload);
      this.$emit(payload, meta);
    },
    emitHistoricalEvents(events, limit = constants.DEPLOY_OFFSET) {
      for (const event of events.slice(0, limit)) {
        const meta = this.generateMeta(event);
        this.$emit(event, meta);
      }
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.app.createWebhook(this.siteId, {
        url: this.http.endpoint,
        triggerType: this.getWebhookTriggerType(),
      });

      this._setWebhookId(webhook?.id);
    },
    async deactivate() {
      await this.app.removeWebhook(this._getWebhookId());
    },
  },
  async run(event) {
    await this.processEvent(event);
  },
};
