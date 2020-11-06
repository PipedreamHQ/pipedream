const hubspot = require("../../hubspot.app.js");

module.exports = {
  key: "hubspot-deal-updated",
  name: "Deal Updated",
  description: "Emits an event each time a deal is updated.",
  version: "0.0.1",
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
    const lastRun = this.db.get("updatedAfter") || this.hubspot.monthAgo();
    const updatedAfter = new Date(lastRun);
    const data = {
      limit: 100,
      sorts: [
        {
          propertyName: "hs_lastmodifieddate",
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
        let updatedAt = new Date(deal.updatedAt);
        if (updatedAt.getTime() > updatedAfter.getTime()) {
          this.$emit(deal, {
            id: deal.id,
            summary: deal.properties.dealname,
            ts: updatedAt.getTime(),
          });
        } else {
          // don't need to continue if we've gotten to contacts already evaluated
          done = true;
        }
        count++;
      }
    }

    this.db.set("updatedAfter", Date.now());
  },
};