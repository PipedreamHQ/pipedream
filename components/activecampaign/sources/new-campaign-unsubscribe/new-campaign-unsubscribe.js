const activecampaign = require("../../activecampaign.app.js");

module.exports = {
  name: "New Campaign Unsubscribe (Instant)",
  key: "activecampaign-new-campaign-unsubscribe",
  description:
    "Emits an event when a contact unsubscribes as a result of a campaign email sent to them.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    activecampaign,
    db: "$.service.db",
    http: "$.interface.http",
    campaigns: { propDefinition: [activecampaign, "campaigns"] },
  },
  hooks: {
    async activate() {
      const sources = ["public", "admin", "api", "system"]; // all available sources
      const hookData = await this.activecampaign.createHook(
        ["unsubscribe"],
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
    if (
      this.campaigns.length > 0 &&
      !this.campaigns.includes(body["campaign[id]"])
    )
      return;
    const dateTime = new Date(body.date_time);
    this.$emit(body, {
      id: `${body["campaign[id]"]}${body["contact[id]"]}`,
      summary: `${body["contact[email]"]}, Campaign: ${body["campaign[name]"]}`,
      ts: dateTime.getTime(),
    });
  },
};