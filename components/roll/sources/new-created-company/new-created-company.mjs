import common from "../common/base.mjs";

export default {
  ...common,
  name: "New Created Company",
  key: "roll-new-created-company",
  description: "Emit new event when a company is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldId() {
      return "CompanyId";
    },
    getFieldResponse() {
      return "company";
    },
    getQuery() {
      return "listCompanies";
    },
    getOrderField() {
      return "-CompanyId";
    },
    getDataToEmit({ CompanyId }) {
      return {
        id: CompanyId,
        summary: `New company with CompanyId ${CompanyId} was successfully created!`,
        ts: new Date().getTime(),
      };
    },
  },
};

