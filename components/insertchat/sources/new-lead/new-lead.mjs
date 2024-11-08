import insertchat from "../../insertchat.app.mjs";

export default {
  key: "insertchat-new-lead",
  name: "New Lead Created",
  description: "Emits a new event when a new lead is created. Best for real-time CRM integration.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    insertchat,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    leadContactInfo: {
      propDefinition: [
        insertchat,
        "leadContactInfo",
      ],
      required: true,
    },
  },
  methods: {
    _getLeadId() {
      return this.db.get("leadId") || null;
    },
    _setLeadId(leadId) {
      this.db.set("leadId", leadId);
    },
  },
  hooks: {
    async deploy() {
      const lead = await this.insertchat.emitNewLead(this.leadContactInfo);
      this._setLeadId(lead.id);
      this.$emit(lead, {
        id: lead.id,
        summary: `New Lead: ${lead.name}`,
        ts: Date.now(),
      });
    },
  },
  async run() {
    const lead = await this.insertchat.emitNewLead(this.leadContactInfo);
    if (lead.id !== this._getLeadId()) {
      this._setLeadId(lead.id);
      this.$emit(lead, {
        id: lead.id,
        summary: `New Lead: ${lead.name}`,
        ts: Date.now(),
      });
    }
  },
};
