const activecampaign = require("../../activecampaign.app.js");

module.exports = {
  name: "New Deal Added or Updated (Instant)",
  key: "activecampaign-new-or-updated-deal",
  description: "Emits an event each time a deal is added or updated.",
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
        ["deal_add", "deal_update"],
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
      id: `${body["deal[id]"]}${dateTime.getTime()}`,
      summary: body["deal[title]"],
      ts: dateTime.getTime(),
    });
  },
};