const hubspot = require("../../hubspot.app.js");

module.exports = {
  key: "hubspot-new-engagement",
  name: "New Engagement",
  description: "Emits an event for each new engagement created.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    hubspot,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run(event) {
    const lastRun = this.db.get("createdAfter") || this.hubspot.monthAgo();
    const createdAfter = new Date(lastRun);

    const results = await this.hubspot.getEngagements(createdAfter.getTime());
    for (const result of results) {
      let createdAt = new Date(result.engagement.createdAt);
      this.$emit(result, {
        id: result.engagement.id,
        summary: result.engagement.type,
        ts: result.engagement.createdAt,
      });
    }

    this.db.set("createdAfter", Date.now());
  },
};