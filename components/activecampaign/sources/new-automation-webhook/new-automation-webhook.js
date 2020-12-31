const activecampaign = require("../../activecampaign.app.js");

module.exports = {
  name: "New Automation Webhook",
  key: "activecampaign-new-automation-webhook",
  description: "Emits an event each time an automation sends out webhook data.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    activecampaign,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    automations: { propDefinition: [activecampaign, "automations"] },
  },
  async run() {
    const limit = 100; // limit of tasks per page
    let offset = 0; // offset for pagination
    let total = limit; // total tasks retrieved in a page
    while (total == limit) {
      const results = (await this.activecampaign.listAutomations(limit, offset))
        .automations;
      for (const automation of results) {
        const entered = this.db.get(automation.id) || 0; // number of times automation has run
        if (parseInt(automation.entered) <= entered) continue;
        if (
          this.automations.length > 0 &&
          !this.automations.includes(automation.id)
        )
          continue;
        this.$emit(automation, {
          id: `${automation.id}${automation.entered}`,
          summary: automation.name,
          ts: Date.now(),
        });
        this.db.set(automation.id, parseInt(automation.entered));
      }
      total = results.length;
      offset += limit;
    }
  },
};