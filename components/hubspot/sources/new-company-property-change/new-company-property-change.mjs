import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-company-property-change",
  name: "New Company Property Change",
  description: "Emit new event when a specified property is provided or updated on a company. [See the docs here](https://developers.hubspot.com/docs/api/crm/companies)",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    property: {
      type: "string",
      label: "Property",
      description: "The company property to watch for changes",
      async options() {
        const { results: properties } = await this.hubspot.getProperties("companies");
        return properties.map((property) => property.name);
      },
    },
  },
  hooks: {},
  methods: {
    ...common.methods,
    getTs(company) {
      const history = company.propertiesWithHistory[this.property];
      if (!history || !(history.length > 0)) {
        return;
      }
      return Date.parse(history[0].timestamp);
    },
    generateMeta(company) {
      const {
        id,
        properties,
      } = company;
      const ts = this.getTs(company);
      return {
        id: `${id}${ts}`,
        summary: properties.name,
        ts,
      };
    },
    isRelevant(company, updatedAfter) {
      return !updatedAfter || this.getTs(company) > updatedAfter;
    },
    getParams() {
      return {
        limit: 50,
        sorts: [
          {
            propertyName: "hs_lastmodifieddate",
            direction: "DESCENDING",
          },
        ],
        propertiesWithHistory: this.property,
      };
    },
    async processResults(after, params) {
      const { results } = await this.hubspot.listObjectsInPage("companies", null, params);

      let maxTs = after;
      for (const result of results) {
        if (this.isRelevant(result, after)) {
          this.emitEvent(result);
          const ts = this.getTs(result);
          if (ts > maxTs) {
            maxTs = ts;
          }
        }
      }

      this._setAfter(maxTs);
    },
  },
};
