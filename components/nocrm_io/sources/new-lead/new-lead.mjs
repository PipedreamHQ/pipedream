import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Lead",
  version: "0.0.1",
  key: "nocrm_io-new-lead",
  description: "Emit new event on each lead created.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "lead.creation";
    },
    emitEvent(body) {
      const data = body?.webhook_event?.data ?? body;

      this.$emit(data, {
        id: data.id,
        summary: `New lead with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    async deploy() {
      const leads = await this.nocrm_io.getLeads({
        params: {
          limit: 10,
        },
      });

      if (leads) {
        leads.forEach(this.emitEvent);
      }
    },
  },
};
