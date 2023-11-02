import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import meetingpulse from "../../meetingpulse.app.mjs";

export default {
  key: "meetingpulse-new-lead",
  name: "New Lead",
  description: "Emit new event for each new lead generated. [See the documentation](https://app.meet.ps/api/docs/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    meetingpulse,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    meetingId: {
      propDefinition: [
        meetingpulse,
        "meetingId",
      ],
    },
  },
  methods: {
    _getLeadId(lead) {
      return lead.id;
    },
    _getStoredLeadIds() {
      return this.db.get("leadIds") || [];
    },
    _storeLeadIds(leadIds) {
      this.db.set("leadIds", leadIds);
    },
  },
  hooks: {
    async deploy() {
      const leads = await this.meetingpulse.getEmailLeads({
        meetingId: this.meetingId,
      });
      const leadIds = leads.map(this._getLeadId);
      this._storeLeadIds(leadIds);
    },
  },
  async run() {
    const leads = await this.meetingpulse.getEmailLeads({
      meetingId: this.meetingId,
    });
    const storedLeadIds = this._getStoredLeadIds();
    for (const lead of leads) {
      const leadId = this._getLeadId(lead);
      if (!storedLeadIds.includes(leadId)) {
        this.$emit(lead, {
          id: leadId,
          summary: `New lead: ${lead.email}`,
          ts: Date.now(),
        });
        storedLeadIds.push(leadId);
      }
    }
    this._storeLeadIds(storedLeadIds);
  },
};
