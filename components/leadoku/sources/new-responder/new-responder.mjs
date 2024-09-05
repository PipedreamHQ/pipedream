import common from "../common/base.mjs";

export default {
  ...common,
  key: "leadoku-new-responder",
  name: "New Responder",
  description: "Emit new event when there is a new responder in Leadoku. [See the documentation](https://help.leadoku.io/en/articles/8261580-leadoku-api-for-custom-integrations)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.leadoku.getNewResponders;
    },
    getTsField() {
      return "message_scan_date";
    },
    getSummary() {
      return "New Responder";
    },
  },
};
