import common from "../common/common.mjs";

export default {
  ...common,
  key: "intercom-new-company",
  name: "New Companies",
  description: "Emit new event each time a new company is added.",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta({
      id, name, created_at: createdAt,
    }) {
      return {
        id,
        summary: name,
        ts: createdAt,
      };
    },
  },
  async run() {
    let lastCompanyCreatedAt = this._getLastUpdate();

    const companies = await this.intercom.getCompanies(lastCompanyCreatedAt);
    for (const company of companies) {
      if (company.created_at > lastCompanyCreatedAt)
        lastCompanyCreatedAt = company.created_at;
      const meta = this.generateMeta(company);
      this.$emit(company, meta);
    }

    this._setLastUpdate(lastCompanyCreatedAt);
  },
};
