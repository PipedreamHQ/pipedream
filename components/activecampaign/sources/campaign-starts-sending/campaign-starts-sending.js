const activecampaign = require("../../activecampaign.app.js");

module.exports = {
  name: "Campaign Starts Sending (Instant)",
  key: "activecampaign-campaign-starts-sending",
  description: "Emits an event each time a campaign starts sending.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    activecampaign,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const sources = ["public", "admin", "api", "system"]; // all available sources
      const hookData = await this.activecampaign.createHook(
        ["sent"],
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
    const dateTime = new Date(body.date_time);
    this.$emit(body, {
      id: body["campaign[id]"],
      summary: body["campaign[name]"],
      ts: dateTime.getTime(),
    });
  },
};