import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "getprospect-new-company-created",
  name: "New Company Created",
  description: "Emit new event when a new company is added to the GetProspect companies database. [See the documentation](https://getprospect.readme.io/reference/publicapiinsightscontroller_publicsearchcompanies)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.getprospect.listCompanies;
    },
    getData(lastTs) {
      return lastTs
        ? {
          lastUpdated: lastTs,
        }
        : undefined;
    },
    generateMeta(item) {
      return {
        id: item.getProspectId,
        summary: `New Company with ID: ${item.getProspectId}`,
        ts: Date.now(),
      };
    },
  },
};
