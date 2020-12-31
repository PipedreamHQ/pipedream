const activecampaign = require("../../activecampaign.app.js");

module.exports = {
  name: "New Event (Instant)",
  key: "activecampaign-new-event",
  description:
    "Emits an event for the specified event type from ActiveCampaign.",
  version: "0.0.1",
  props: {
    activecampaign,
    db: "$.service.db",
    hhttp: "$.interface.http",
    eventType: { propDefinition: [activecampaign, "eventType"] },
  },
  hooks: {
    async activate() {
      const sources = ["public", "admin", "api", "system"]; // all available sources
      const hookData = await this.activecampaign.createHook(
        [this.eventType],
        this.http.endpoint,
        sources
      );
      this.db.set("hookId", hookData.webhook.id);
    },
    async deactivate() {
      await this.activecampaign.deleteHook(this.db.get("hookId"));
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }
    this.$emit(body, {
      id: body.date_time,
      summary: `${body.type} initiated by ${body.initiated_by}`,
      ts: Date.now(),
    });
  },
};