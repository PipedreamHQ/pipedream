const hubspot = require("../../hubspot.app.js");

module.exports = {
  key: "hubspot-new-deal-in-stage",
  name: "New Deal In Stage",
  description: "Emits an event for each new deal in a stage.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    hubspot,
    stages: {
      type: "string[]",
      label: "Stages",
      optional: false,
      async options() {
        const results = await this.hubspot.getDealStages();
        const options = results.results[0].stages.map((result) => {
          const label = result.label;
          return {
            label,
            value: JSON.stringify({ label, value: result.stageId }),
          };
        });
        return options;
      },
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    generateMeta(deal, stage, updatedAt) {
      return {
        id: `${deal.id}${deal.properties.dealstage}`,
        summary: `${deal.properties.dealname} ${stage.label}`,
        ts: updatedAt.getTime(),
      };
    },
  },
  async run(event) {
    const lastRun = this.db.get("updatedAfter") || this.hubspot.monthAgo();
    const updatedAfter = new Date(lastRun);

    for (let stage of this.stages) {
      stage = JSON.parse(stage);
      const data = {
        limit: 100,
        filters: [
          {
            propertyName: "dealstage",
            operator: "EQ",
            value: stage.value,
          },
        ],
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
        else delete data.after;
        for (const deal of deals.results) {
          let updatedAt = new Date(deal.updatedAt);
          if (updatedAt.getTime() > updatedAfter.getTime()) {
            this.$emit(deal, this.generateMeta(deal, stage, updatedAt));
          } else {
            // don't need to continue if we've gotten to deals already evaluated
            done = true;
          }
          count++;
        }
      }
    }

    this.db.set("updatedAfter", Date.now());
  },
};