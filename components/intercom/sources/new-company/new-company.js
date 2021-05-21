const intercom = require("../../intercom.app.js");

module.exports = {
  key: "intercom-new-company",
  name: "New Companies",
  description: "Emits an event each time a new company is added.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    intercom,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run(event) {
    const monthAgo = this.intercom.monthAgo();
    let lastCompanyCreatedAt =
      this.db.get("lastCompanyCreatedAt") || Math.floor(monthAgo / 1000);

    const companies = await this.intercom.getCompanies(lastCompanyCreatedAt);
    for (const company of companies) {
      if (company.created_at > lastCompanyCreatedAt)
        lastCompanyCreatedAt = company.created_at;
      this.$emit(company, {
        id: company.id,
        summary: company.name,
        ts: company.created_at,
      });
    }

    this.db.set("lastCompanyCreatedAt", lastCompanyCreatedAt);
  },
};