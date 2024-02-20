import common from "../common/common.mjs";
import { API_PATH } from "../../common/constants.mjs";

export default {
  ...common,
  key: "hubspot-new-company-property-change",
  name: "New Company Property Change",
  description: "Emit new event when a specified property is provided or updated on a company. [See the documentation](https://developers.hubspot.com/docs/api/crm/companies)",
  version: "0.0.5",
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
      const { results: properties } = await this.hubspot.getProperties("companies");
      const propertyNames = properties.map((property) => property.name);
      if (!propertyNames.includes(this.property)) {
        throw new Error(`Property "${this.property}" not supported for Companies. See Hubspot's default company properties documentation - https://knowledge.hubspot.com/companies/hubspot-crm-default-company-properties`);
      }

      const updatedCompanies = await this.getPaginatedItems(this.hubspot.searchCRM, params);

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
