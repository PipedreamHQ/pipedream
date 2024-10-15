import suitedash from "../../suitedash.app.mjs";

export default {
  key: "suitedash-new-company",
  name: "New Company",
  description: "Emits an event when a new company is created in SuiteDash",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    suitedash,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, timestamp, name,
      } = data;
      return {
        id,
        summary: `New company created: ${name}`,
        ts: timestamp,
      };
    },
  },
  async run() {
    const lastRun = this.db.get("lastRun") || this.timer.timestamp;
    const companies = await this.suitedash.getCompanies();
    for (const company of companies) {
      if (company.timestamp > lastRun) {
        const meta = this.generateMeta(company);
        this.$emit(company, meta);
      }
    }
    this.db.set("lastRun", this.timer.timestamp);
  },
};
