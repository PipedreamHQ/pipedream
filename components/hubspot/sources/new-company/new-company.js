const hubspot = require("../../hubspot.app.js");

module.exports = {
  key: "hubspot-new-company",
  name: "New Companies",
  description: "Emits an event for each new company added.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    hubspot,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  async run(event) {
    const lastRun = this.db.get("createdAfter") || this.hubspot.monthAgo();
    const createdAfter = new Date(lastRun);
    const data = {
      limit: 100,
      sorts: [
        {
          propertyName: "createdate",
          direction: "DESCENDING",
        },
      ],
    };

    let done = false;
    let count = 0;
    let total = 1;

    while (!done && count < total) {
      let companies = await this.hubspot.searchCRM(data, "companies");
      total = companies.total;
      if (companies.paging) data.after = companies.paging.next.after;
      for (const company of companies.results) {
        let createdAt = new Date(company.createdAt);
        if (createdAt.getTime() > createdAfter.getTime()) {
          this.$emit(company, {
            id: company.id,
            summary: company.properties.name,
            ts: createdAt.getTime(),
          });
        } else {
          // don't need to continue if we've gotten to companies already evaluated
          done = true;
        }
        count++;
      }
    }

    this.db.set("createdAfter", Date.now());
  },
};