import { axios } from "@pipedream/platform";
import workamajig from "../../workamajig.app.mjs";

export default {
  key: "workamajig-new-lead-instant",
  name: "New Lead Instant",
  description: "Emits a new event when a new lead is created in Workamajig",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    workamajig,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    leadType: {
      propDefinition: [
        workamajig,
        "leadType",
      ],
      optional: true,
    },
  },
  methods: {
    ...workamajig.methods,
    async getNewLeads() {
      return this._makeRequest({
        method: "GET",
        path: "/leads",
      });
    },
  },
  hooks: {
    async deploy() {
      const leads = await this.getNewLeads();
      leads.slice(0, 50).forEach((lead) => {
        this.$emit(lead, {
          id: lead.id,
          summary: `New Lead: ${lead.name}`,
          ts: Date.parse(lead.created_at),
        });
      });
    },
  },
  async run() {
    const leads = await this.getNewLeads();
    leads.forEach((lead) => {
      this.$emit(lead, {
        id: lead.id,
        summary: `New Lead: ${lead.name}`,
        ts: Date.parse(lead.created_at),
      });
    });
  },
};
