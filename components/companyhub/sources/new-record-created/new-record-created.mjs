import common from "../common/base.mjs";

export default {
  ...common,
  key: "companyhub-new-record-created",
  name: "New Record Created",
  description: "Emit new event when a new record is created in a specified custom table. [See the documentation](https://companyhub.com/docs/api-documentation)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    table: {
      type: "string",
      label: "Table Name",
      description: "The name of the table to monitor for new records",
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.companyhub.listRecords;
    },
    getArgs() {
      return {
        table: this.table,
      };
    },
    getSummary(item) {
      return `New Record with ID: ${item.ID}`;
    },
  },
};
