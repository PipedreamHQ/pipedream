import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-new-lead",
  name: "New Qualified Lead",
  description: "Emit an event each time a conversation is marked as a qualified lead in your Instant Reply pipeline. Use this to push new leads into HubSpot, Pipedrive, a Google Sheet, or any CRM.",
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
        summary: `New lead: ${event.contact_name || event.contact_id} via ${event.channel}`,
        ts: Date.parse(event.created_at),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let newLastTs = lastTs;

    const response = await this.instantReply.getWebhookEvents({
      params: {
        type: "lead.qualified",
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
