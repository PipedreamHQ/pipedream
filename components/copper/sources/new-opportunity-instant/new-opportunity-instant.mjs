import copper from "../../copper.app.mjs";

export default {
  key: "copper-new-opportunity-instant",
  name: "New Opportunity Instant",
  description: "Emits an event when a new opportunity is created in Copper",
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
        id, name, date_created: created,
      } = data;
      const ts = new Date(created).getTime();
      return {
        id,
        summary: `New Opportunity: ${name}`,
        ts,
      };
    },
  },
  hooks: {
    async deploy() {
      const opportunities = await this.copper.getNewOpportunity();
      for (const opportunity of opportunities) {
        this.$emit(opportunity, {
          id: opportunity.id,
          summary: `New Opportunity: ${opportunity.name}`,
          ts: Date.parse(opportunity.date_created),
        });
      }
    },
  },
  async run() {
    const lastRun = this.db.get("lastRun") || this.copper._baseUrl() + "/opportunity/new";
    const { data } = await this.copper._makeRequest({
      path: lastRun,
    });
    if (data.length > 0) {
      const { id: lastId } = data[data.length - 1];
      this.db.set("lastRun", lastId);
      data.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    }
  },
};
