const hubspot = require("../../hubspot.app.js");
const get = require("lodash.get")

module.exports = {
  key: "hubspot-deal-property-change",
  name: "New Deal Property Change",
  description:
    "Emits an event each time the specified properties are updated on a deal.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    hubspot,
    properties: {
      type: "string[]",
      label: "Properties",
      optional: false,
      async options() {
        const results = await this.hubspot.getDealProperties();
        const options = results.map((result) => {
          const label = result.label;
          return {
            label,
            value: JSON.stringify({ label, value: result.name }),
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
    generateMeta(deal, prop, updatedAt) {
      return {
        id: `${deal.id}${prop.value}${deal.properties[prop.value].value}`,
        summary: `${prop.label} changed on ${deal.properties.dealname.value}`,
        ts: updatedAt.getTime(),
      }
    }
  },
  async run(event) {
    const lastRun = this.db.get("updatedAfter") || this.hubspot.monthAgo();
    const updatedAfter = new Date(lastRun);

    const property = this.properties.map(p => JSON.parse(p).value)

    const params = {
      count: 20,
      property,
      includePropertyVersions: true,
      since: updatedAfter.getTime(),
    };

    let hasMore = true;

    while (hasMore) {
      let results = await this.hubspot.getRecentlyUpdatedDeals(params);
      hasMore = results["has-more"];
      if (hasMore) params.vidOffset = results["vid-offset"];
      for (const deal of results.results) {
        for (let prop of this.properties) {
          prop = JSON.parse(prop);
          if (deal.properties[prop.value]) {
            let updatedAt = new Date(
              get(deal, `properties[${prop.value}].versions[0].timestamp`)
            );
            if (updatedAt > updatedAfter) {
              this.$emit(deal, this.generateMeta(deal, prop, updatedAt));
            }
          }
        }
      }
    }

    this.db.set("updatedAfter", Date.now());
  },
};