import common from "../common/base.mjs";

export default {
  ...common,
  key: "kenjo-new-company-created",
  name: "New Company Created",
  description: "Emit new event when a new company is created in Kenjo. [See the documentation](https://kenjo.readme.io/reference/get_companies)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.kenjo.listCompanies;
    },
    generateMeta(company) {
      return {
        id: company._id,
        summary: `New Company: ${company.name}`,
        ts: Date.now(),
      };
    },
  },
};
