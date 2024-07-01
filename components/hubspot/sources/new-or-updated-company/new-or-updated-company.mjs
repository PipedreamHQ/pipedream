import common from "../common/common.mjs";
import {
  DEFAULT_LIMIT, DEFAULT_COMPANY_PROPERTIES,
} from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-or-updated-company",
  name: "New or Updated Company",
  description: "Emit new event for each new or updated company in Hubspot.",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    info: {
      type: "alert",
      alertType: "info",
      content: `Properties:\n\`${DEFAULT_COMPANY_PROPERTIES.join(", ")}\``,
    },
    properties: {
      propDefinition: [
        common.props.hubspot,
        "companyProperties",
        () => ({
          excludeDefaultProperties: true,
        }),
      ],
      label: "Additional properties to retrieve",
    },
    newOnly: {
      type: "boolean",
      label: "New Only",
      description: "Emit events only for new companies",
      default: false,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getTs(company) {
      return this.isNew
        ? Date.parse(company.createdAt)
        : Date.parse(company.updatedAt);
    },
    generateMeta(company) {
      const {
        id,
        properties,
      } = company;
      const ts = this.getTs(company);
      return {
        id: this.newOnly
          ? id
          : `${id}-${ts}`,
        summary: properties.name,
        ts,
      };
    },
    isRelevant(company, updatedAfter) {
      return this.getTs(company) > updatedAfter;
    },
    getParams() {
      const { properties = [] } = this;
      return {
        data: {
          limit: DEFAULT_LIMIT,
          sorts: [
            {
              propertyName: "hs_lastmodifieddate",
              direction: "DESCENDING",
            },
          ],
          properties: [
            ...DEFAULT_COMPANY_PROPERTIES,
            ...properties,
          ],
        },
        object: "companies",
      };
    },
    async processResults(after, params) {
      await this.searchCRM(params, after);
    },
  },
  sampleEmit,
};
