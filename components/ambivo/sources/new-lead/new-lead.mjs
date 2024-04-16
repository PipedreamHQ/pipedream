import ambivo from "../../ambivo.app.mjs";

export default {
  key: "ambivo-new-lead",
  name: "New Lead Created",
  description: "Emits a new event when a new lead is created in Ambivo CRM. [See the documentation](https://fapi.ambivo.com/docs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ambivo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getLeadId(lead) {
      return lead._id;
    },
    _getLeadTimestamp(lead) {
      return Date.parse(lead.created);
    },
  },
  hooks: {
    async deploy() {
      const leads = await this.ambivo.getNewLead();
      if (leads.length > 0) {
        const maxLead = leads.reduce((prev, current) => (prev.id > current.id)
          ? prev
          : current);
        this.db.set("lastLeadId", maxLead.id);
      }
    },
  },
  async run() {
    const newLeads = await this.ambivo.getNewLead();
    const lastLeadId = this.db.get("lastLeadId");
    for (const lead of newLeads) {
      if (lead.id > lastLeadId) {
        this.$emit(lead, {
          id: this._getLeadId(lead),
          summary: `New Lead: ${lead.name}`,
          ts: this._getLeadTimestamp(lead),
        });
      }
    }
    if (newLeads.length > 0) {
      const maxLead = newLeads.reduce((prev, current) => (prev.id > current.id)
        ? prev
        : current);
      this.db.set("lastLeadId", maxLead.id);
    }
  },
};
