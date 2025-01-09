import instantly from "../../instantly.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "instantly-new-event-instant",
  name: "New Event in Instantly (Instant)",
  description: "Emit new event when an activity occurs in your Instantly workspace.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    instantly,
    http: "$.interface.http",
    db: "$.service.db",
    campaignId: {
      propDefinition: [
        instantly,
        "campaignId",
      ],
      optional: true,
    },
    eventType: {
      propDefinition: [
        instantly,
        "eventType",
      ],
      optional: true,
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  hooks: {
    async activate() {
      const response = await this.instantly.createWebhook({
        data: {
          hookUrl: this.http.endpoint,
          event_type: this.eventType,
          campaign: this.campaignId,
        },
      });
      this._setHookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      await this.instantly.deleteWebhook({
        data: {
          hook_id: webhookId,
        },
      });
    },
  },
  async run({ body }) {
    const ts = Date.parse(new Date());
    this.$emit(body, {
      id: `${body.resource}-${ts}`,
      summary: `New event from ${body.lead_email} for campaign ${body.campaign_name}`,
      ts: ts,
    });
  },
  sampleEmit,
};
