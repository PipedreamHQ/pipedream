import copper from "../../copper.app.mjs";

export default {
  key: "copper-new-lead-instant",
  name: "New Lead Instant",
  description: "Emits an event when a new lead is created in Copper",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    copper,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },

  methods: {
    generateMeta(data) {
      const {
        id, name, created_date: createdDate,
      } = data;
      const ts = new Date(createdDate).getTime();
      return {
        id,
        summary: name,
        ts,
      };
    },
  },

  async run() {
    const lastRun = this.db.get("lastRun") || this.timer.intervalSeconds;
    const now = Math.floor(Date.now() / 1000);

    const newLeads = await this.copper.getNewLead();
    newLeads.forEach((lead) => {
      if (lead.created_date >= lastRun && lead.created_date < now) {
        const meta = this.generateMeta(lead);
        this.$emit(lead, meta);
      }
    });

    this.db.set("lastRun", now);
  },
};
