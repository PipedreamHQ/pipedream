import { DEFAULT_LIMIT } from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-company-property-change",
  name: "New Company Property Change",
  description: "Emit new event when a specified property is provided or updated on a company. [See the documentation](https://developers.hubspot.com/docs/api/crm/companies)",
  version: "0.0.24",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    property: {
      type: "string",
      label: "Property",
      description: "The company property to watch for changes",
      async options() {
        const properties = await this.getWriteOnlyProperties("companies");
        return properties.map((property) => property.name);
      },
    },
  },
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
        id, properties,
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
        data: {
          limit: DEFAULT_LIMIT,
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
        },
      };
    },
    batchGetCompanies(inputs) {
      return this.hubspot.batchGetObjects({
        objectType: "companies",
        data: {
          properties: [
            this.property,
          ],
          propertiesWithHistory: [
            this.property,
          ],
          inputs,
        },
      });
    },
    async processResults(after, params) {
      const properties = await this.getWriteOnlyProperties("companies");
      const propertyNames = properties.map((property) => property.name);

      if (!propertyNames.includes(this.property)) {
        throw new Error(
          `Property "${this.property}" not supported for Companies. See Hubspot's default company properties documentation - https://knowledge.hubspot.com/companies/hubspot-crm-default-company-properties`,
        );
      }

      const updatedCompanies = await this.getPaginatedItems(
        this.hubspot.searchCRM,
        params,
      );

      if (!updatedCompanies.length) {
        return;
      }

      const results = await this.processChunks({
        batchRequestFn: this.batchGetCompanies,
        chunks: this.getChunks(updatedCompanies),
      });

      this.processEvents(results, after);
    },
  },
  sampleEmit,
};
