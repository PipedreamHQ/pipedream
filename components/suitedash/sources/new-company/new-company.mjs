import common from "../common/base.mjs";

export default {
  ...common,
  key: "suitedash-new-company",
  name: "New Company Created",
  description: "Emit new event when a new company is created in SuiteDash",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFn() {
      return this.suitedash.listCompanies;
    },
    getSummary(company) {
      if (!company || typeof company !== "object") {
        return "New Company: Unknown";
      }
      const name = company.name || "Unnamed";
      return `New Company: ${name}`;
    },
  },
};
