import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Lead Status Changed",
  version: "0.0.1",
  key: "nocrm_io-new-lead-status-changed",
  description: "Emit new event when a lead status is changed.",
  type: "source",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "lead.status.changed";
    },
    emitEvent(body) {
      const data = body?.webhook_event?.data ?? body;

      this.$emit(data, {
        id: `${data.id}-${data.status}-${data.created_at}`,
        summary: `New lead status changed with id ${data.id} and status ${data.status}`,
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
