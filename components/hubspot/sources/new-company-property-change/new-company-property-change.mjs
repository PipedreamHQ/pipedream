import common from "../common.mjs";
import { API_PATH } from "../../common/constants.mjs";

export default {
  ...common,
  key: "hubspot-new-company-property-change",
  name: "New Company Property Change",
  description: "Emit new event when a specified property is provided or updated on a company. [See the docs here](https://developers.hubspot.com/docs/api/crm/companies)",
  version: "0.0.3",
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
        summary: properties[this.property],
        ts,
      };
    },
    isRelevant(company, updatedAfter) {
      return !updatedAfter || this.getTs(company) > updatedAfter;
    },
    getParams(after) {
      return {
        object: "companies",
        limit: 50,
        properties: [
          this.property,
        ],
        sorts: [
          {
            propertyName: "hs_lastmodifieddate",
            direction: "DESCENDING",
          },
        ],
        filterGroups: [
          {
            filters: [
              {
                propertyName: this.property,
                operator: "HAS_PROPERTY",
              },
              {
                propertyName: "hs_lastmodifieddate",
                operator: "GTE",
                value: after,
              },
            ],
          },
        ],
      };
    },
    async batchGetCompanies(inputs) {
      return this.hubspot.makeRequest(
        API_PATH.CRMV3,
        "/objects/companies/batch/read",
        {
          method: "POST",
          data: {
            properties: [
              this.property,
            ],
            propertiesWithHistory: [
              this.property,
            ],
            inputs,
          },
        },
      );
    },
    async processResults(after, params) {
      const updatedCompanies = [];
      do {
        const {
          results, paging,
        } = await this.hubspot.searchCRM(params);
        updatedCompanies.push(...results);
        if (paging) {
          params.after = paging.next.after;
        } else {
          delete params.after;
        }
      } while (params.after);

      if (!updatedCompanies.length) {
        return;
      }

      const inputs = updatedCompanies.map(({ id }) => ({
        id,
      }));
      // get companies w/ `propertiesWithHistory`
      const { results } = await this.batchGetCompanies(inputs);

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
