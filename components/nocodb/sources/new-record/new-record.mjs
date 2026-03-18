import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Record in Table",
  key: "nocodb-new-record",
  description: "Emit new event for each new record in table. [See the documentation](https://data-apis-v2.nocodb.com/#tag/Table-Records/operation/db-data-table-row-list)",
  version: "0.0.8",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getDataToEmit({ Id }) {
      const ts = new Date().getTime();
      return {
        id: Id,
        summary: `New record created (${Id})`,
        ts,
      };
    },
    getTimeField() {
      return "CreatedAt";
    },
  },
};
