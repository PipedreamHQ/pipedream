import common from "../common/polling.mjs";

export default {
  ...common,
  key: "smoove-new-form-created",
  name: "New Form Created",
  description: "Emit new event when a new form is created. [See the docs](https://rest.smoove.io/#!/LandingPages/LandingPages_GetActivePages).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getLandingPages;
    },
    getResourceFnArgs() {
      return {
        params: {
          type: "All",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.formId,
        ts: Date.now(),
        summary: `New Form Created ${resource.formId}`,
      };
    },
  },
};
