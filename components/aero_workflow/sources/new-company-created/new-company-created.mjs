import common from "../common/common.mjs";

export default {
  ...common,
  key: "aero_workflow-new-company-created",
  name: "New Company Created Event",
  description: "Emit new events when a new company is created. [See the docs](https://api.aeroworkflow.com/swagger/index.html)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFnConfig() {
      return {
        resourceFn: this.app.getCompanies,
        resourceKey: "companies",
      };
    },
    getComparable(item) {
      return item.id;
    },
    getMeta(item) {
      return {
        id: item.id,
        summary: `New company was created: ${item.name}(ID: ${item.id})`,
        ts: new Date().getTime(),
      };
    },
    async getItem(item) {
      return this.app.getCompany({
        companyId: item.id,
      });
    },
  },
};
