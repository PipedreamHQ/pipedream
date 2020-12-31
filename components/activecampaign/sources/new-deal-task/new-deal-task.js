const activecampaign = require("../../activecampaign.app.js");

module.exports = {
  name: "New Deal Task (Instant)",
  key: "activecampaign-new-deal-task",
  description: "Emits an event each time a new task is added to a deal.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    activecampaign,
    db: "$.service.db",
    http: "$.interface.http",
    deals: { propDefinition: [activecampaign, "deals"] },
  },
  hooks: {
    async activate() {
      const sources = ["public", "admin", "api", "system"]; // all available sources
      const hookData = await this.activecampaign.createHook(
        ["deal_task_add"],
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
    if (this.deals.length > 0 && !this.deals.includes(body["deal[id]"])) return;
    const dateTime = new Date(body.date_time);
    this.$emit(body, {
      id: body["task[id]"],
      summary: `${body["task[title]"]} added to ${body["deal[title]"]}`,
      ts: dateTime.getTime(),
    });
  },
};