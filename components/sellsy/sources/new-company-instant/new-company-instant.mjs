import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sellsy-new-company-instant",
  name: "New Company (Instant)",
  description: "Emit new event when a new company (client, prospect, or supplier) is created in Sellsy.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    type: {
      type: "string",
      label: "Type",
      description: "Type of company to watch for",
      options: constants.COMPANY_TYPES,
    },
  },
  methods: {
    ...common.methods,
    getEventType() {
      return `${this.type}.created`;
    },
    getResultItem({ relatedid }) {
      return this.sellsy.getCompany({
        companyId: relatedid,
      });
    },
    generateMeta(company) {
      return {
        id: company.id,
        summary: `New Company with ID: ${company.id}`,
        ts: Date.parse(company.created),
      };
    },
  },
  sampleEmit,
};
