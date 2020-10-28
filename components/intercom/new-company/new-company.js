const intercom = require("../../intercom.app.js")

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

    let done = false;
    let results = null;
    let starting_after = null;

    while (!results || results.data.pages.next) {
      if (results) starting_after = results.data.pages.next.starting_after;
      results = await this.intercom.getCompanies(starting_after);
      for (const company of results.data.data) {
        if (company.created_at > lastCompanyCreatedAt)
          lastCompanyCreatedAt = company.created_at;
        // companies listed in desc order, no need to continue if we've gone past companies already evaluated
        else done = true;
        this.$emit(company, {
          id: company.id,
          summary: company.name,
          ts: company.created_at,
        });
      }
    }

    this.db.set("lastCompanyCreatedAt", lastCompanyCreatedAt);
  },
};