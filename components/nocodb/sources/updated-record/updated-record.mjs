import common from "../common/base.mjs";

export default {
  ...common,
  type: "source",
  name: "New Update in Table",
  key: "nocodb-updated-record",
  description: "Emit new event for each update in table. [See docs here](https://all-apis.nocodb.com/#tag/DB-table-row/operation/db-table-row-list)",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getDataToEmit({
      Id, UpdatedAt,
    }) {
      const ts = new Date().getTime();
      return {
        id: `${Id}${UpdatedAt}`,
        summary: `New update (${Id})`,
        ts,
      };
    },
    getTimeField() {
      return "UpdatedAt";
    },
  },
};
