import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "companyhub-new-company-created",
  name: "New Company Created",
  description: "Emit new event when a new company is created. [See the documentation](https://companyhub.com/docs/api-documentation)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.companyhub.listCompanies;
    },
    getSummary(item) {
      return `New Company: ${item.Name}`;
    },
  },
  sampleEmit,
};
