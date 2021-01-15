const activecampaign = require("../../activecampaign.app.js");
const common = require("../common.js");

module.exports = {
  ...common,
  name: "New Automation Webhook",
  key: "activecampaign-new-automation-webhook",
  description: "Emits an event each time an automation sends out webhook data.",
  version: "0.0.1",
  props: {
    ...common.props,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    automations: { propDefinition: [activecampaign, "automations"] },
  },
  methods: {
    isWatchedAutomation(automation) {
      return (
        this.automations.length === 0 ||
        this.automations.includes(automation.id)
      );
    },
    isAutomationRelevant(automation) {
      if (!this.isWatchedAutomation(automation)) return false;
      const entered = this.db.get(automation.id) || 0; // number of times automation has run
      if (parseInt(automation.entered) <= entered) return false;
      this.db.set(automation.id, parseInt(automation.entered));
      return true;
    },
    getMeta(automation) {
      return {
        id: `${automation.id}${automation.entered}`,
        summary: automation.name,
        ts: Date.now(),
      };
    },
  },
  async run() {
    let prevContext = { offset: 0 };
    let total = 1;
    let count = 0;
    while (count < total) {
      const { results, context } = await this.activecampaign._getNextOptions(
        this.activecampaign.listAutomations.bind(this),
        prevContext
      );
      prevContext = context;
      total = results.meta.total;

      if (total == 0) continue;

      for (const automation of results.automations) {
        count++;
        if (!this.isAutomationRelevant(automation)) continue;
        const { id, summary, ts } = this.getMeta(automation);
        this.$emit(automation, {
          id,
          summary,
          ts,
        });
      }
    }
  },
};