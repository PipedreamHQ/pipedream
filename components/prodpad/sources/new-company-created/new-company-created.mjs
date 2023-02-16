import common from "../common/polling.mjs";

export default {
  ...common,
  key: "prodpad-new-company-created",
  name: "New Company Created",
  description: "Emit new event when a new company is created. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Feedback/GetCompanies).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getRequestResourcesFn() {
      return this.app.listCompanies;
    },
    getResourceName() {
      return "companies";
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `New Company ${resource.id}`,
      };
    },
  },
};
