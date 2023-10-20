import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Company Created",
  key: "pipeline-new-company-created",
  description: "Emit new event when a new company is created in your Pipeline account.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.pipeline.listCompanies;
    },
    generateMeta(company) {
      return {
        id: company.id,
        summary: company.name,
        ts: Date.parse(company.created_at),
      };
    },
  },
};
