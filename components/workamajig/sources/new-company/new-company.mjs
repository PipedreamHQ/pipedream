import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "workamajig-new-company",
  name: "New Company",
  description: "Emit new event when a new company is created in Workamajig",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    text: {
      type: "string",
      label: "Text",
      description: "Filter companies by company name, parent company name, vendor ID or client ID",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.workamajig.searchCompanies;
    },
    getResourceType() {
      return "company";
    },
    getParams() {
      return {
        text: this.text
          ? this.text
          : "",
      };
    },
    getTsField() {
      return "dateAdded";
    },
    generateMeta(company) {
      return {
        id: company.companyKey,
        summary: `New Company ${company.companyKey}`,
        ts: Date.parse(company.dateAdded),
      };
    },
  },
  sampleEmit,
};
