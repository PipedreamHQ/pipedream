import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-new-message",
  name: "New Inbound Message",
  description: "Emit an event each time a new inbound message arrives in your Instant Reply inbox — from WhatsApp, Instagram DM, or Messenger. Use this to trigger CRM updates, Slack notifications, or any downstream workflow.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    instantReply,
    channel: {
      propDefinition: [
        instantReply,
        "channel",
      ],
      optional: true,
      description: "Filter to a specific channel. Leave blank to capture messages from all channels.",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
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
    generateMeta(message) {
      return {
        id: message.id,
        summary: `New ${message.channel} message from ${message.contact_name || message.contact_id}`,
        ts: Date.parse(message.created_at),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let newLastTs = lastTs;

    const response = await this.instantReply.getWebhookEvents({
      params: {
        type: "message.inbound",
        since: new Date(lastTs).toISOString(),
        channel: this.channel || undefined,
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
