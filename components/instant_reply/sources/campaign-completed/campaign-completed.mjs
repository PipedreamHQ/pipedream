import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-campaign-completed",
  name: "Campaign Completed",
  description: "Emit an event each time a broadcast campaign finishes sending. Use this to trigger post-campaign reports, CRM updates, or follow-up sequences.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    instantReply,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 300,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") ?? 0;
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `Campaign completed: ${event.campaign_name || event.campaign_id} — ${event.sent_count ?? 0} sent`,
        ts: Date.parse(event.created_at),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let newLastTs = lastTs;

    const response = await this.instantReply.getWebhookEvents({
      params: {
        type: "campaign.completed",
        since: new Date(lastTs).toISOString(),
        limit: 100,
      },
    });

    const events = response?.data ?? [];

    for (const event of events) {
      const ts = Date.parse(event.created_at);
      if (ts > lastTs) {
        this.$emit(event, this.generateMeta(event));
        if (ts > newLastTs) newLastTs = ts;
      }
    }

    this._setLastTs(newLastTs);
  },
};
