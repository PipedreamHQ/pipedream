import common from "../common/base.mjs";

export default {
  ...common,
  key: "leadoku-new-connection",
  name: "New Connection",
  description: "Emit new event each time a new connection is made in Leadoku. [See the documentation](https://help.leadoku.io/en/articles/8261580-leadoku-api-for-custom-integrations)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.leadoku.getNewConnections;
    },
    getTsField() {
      return "connection_date";
    },
    getSummary() {
      return "New Connection Made";
    },
  },
};
