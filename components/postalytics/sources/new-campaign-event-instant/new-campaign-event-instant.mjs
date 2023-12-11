import postalytics from "../../postalytics.app.mjs";

export default {
  key: "postalytics-new-campaign-event-instant",
  name: "New Campaign Event (Instant)",
  description: "Emit new event when a new campaign event occurs.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    postalytics,
    db: "$.service.db",
    http: "$.interface.http",
    campaignId: {
      propDefinition: [
        postalytics,
        "campaignId",
        () => ({
          flagId: true,
        }),
      ],
    },
  },
  methods: {
    _getLastEventId() {
      return this.db.get("lastEventId") || 0;
    },
    _setLastEventId(eventId) {
      this.db.set("lastEventId", eventId);
    },
  },
  hooks: {
    async activate() {
      await this.postalytics.createHook({
        data: {
          campaign_id: this.campaignId,
          is_enabled: 1,
          url: this.http.endpoint,
        },
      });
    },
    async deactivate() {
      try {
        await this.postalytics.deleteHook(this.campaignId);
      } catch (e) {
        return true;
      }
    },
  },
  async run({ body }) {
    this.$emit(body, {
      id: body.id,
      summary: `New campaign event with ID: ${body.id}`,
      ts: body.created_date,
    });
  },
};
