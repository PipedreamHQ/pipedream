import common from "../common/base.mjs";

export default {
  ...common,
  key: "nocodb-get-record",
  name: "Get Record (from row number)",
  description: "This action gets a row by row Id. [See the documentation](https://data-apis-v2.nocodb.com/#tag/Table-Records/operation/db-data-table-row-read)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    rowId: {
      propDefinition: [
        common.props.nocodb,
        "rowId",
        (c) => ({
          tableId: c.tableId.value,
        }),
      ],
    },
  },
  methods: {
    async processEvent($) {
      return this.nocodb.getTableRow({
        tableId: this.tableId.value,
        rowId: this.rowId,
        $,
      });
    },
    getSummary() {
      return `Record Successfully fetched from ${this.tableId.label} table!`;
    },
  },
};
