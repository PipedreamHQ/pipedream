import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Company",
  key: "teamgate-new-company",
  description: "Emit new event when a new company is created. [See docs here](https://developers.teamgate.com/#cd8d915d-8ba3-4fbc-9932-7e6a3c4dcc08)",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getSummary(name, id) {
      return `New company created: ${name} (${id})`;
    },
    getFunc() {
      return this.teamgate.listCompanies;
    },
  },
};
