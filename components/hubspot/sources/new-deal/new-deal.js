const hubspot = require("../../hubspot.app.js");

module.exports = {
  key: "hubspot-new-deal",
  name: "New Deals",
  description: "Emits an event for each new deal created.",
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
      let deals = await this.hubspot.searchCRM(data, "deals");
      total = deals.total;
      if (deals.paging) data.after = deals.paging.next.after;
      for (const deal of deals.results) {
        let createdAt = new Date(deal.createdAt);
        if (createdAt.getTime() > createdAfter.getTime()) {
          this.$emit(deal, {
            id: deal.id,
            summary: deal.properties.dealname,
            ts: createdAt.getTime(),
          });
        } else {
          // don't need to continue if we've gotten to deals already evaluated
          done = true;
        }
        count++;
      }
    }

    this.db.set("createdAfter", Date.now());
  },
};