import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-new-comment",
  name: "New Comment Received",
  description: "Emit an event each time a new comment is received on one of your Instagram or Facebook posts. Use this to trigger auto-replies, sentiment alerts, or CRM tagging workflows.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    instantReply,
    channel: {
      type: "string",
      label: "Platform",
      description: "Which platform to monitor for comments",
      options: ["instagram", "messenger"],
      optional: true,
    },
    sentiment: {
      type: "string",
      label: "Sentiment Filter",
      description: "Only emit events for comments with this sentiment. Leave blank for all.",
      options: ["positive", "neutral", "negative"],
      optional: true,
    },
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
    generateMeta(comment) {
      return {
        id: comment.id,
        summary: `New ${comment.platform} comment from ${comment.commenter_name || comment.commenter_id}: "${(comment.text || "").slice(0, 60)}"`,
        ts: Date.parse(comment.created_at),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let newLastTs = lastTs;

    const response = await this.instantReply.getWebhookEvents({
      params: {
        type: "comment.received",
        since: new Date(lastTs).toISOString(),
        channel: this.channel || undefined,
        limit: 100,
      },
    });

    const events = response?.data ?? [];

    for (const event of events) {
      if (this.sentiment && event.sentiment !== this.sentiment) continue;
      const ts = Date.parse(event.created_at);
      if (ts > lastTs) {
        this.$emit(event, this.generateMeta(event));
        if (ts > newLastTs) newLastTs = ts;
      }
    }

    this._setLastTs(newLastTs);
  },
};
