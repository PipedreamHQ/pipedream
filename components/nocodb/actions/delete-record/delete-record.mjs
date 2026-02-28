import common from "../common/base.mjs";

export default {
  ...common,
  key: "nocodb-delete-record",
  name: "Delete Record",
  description: "This action deletes a row in a table. [See the documentation](https://data-apis-v2.nocodb.com/#tag/Table-Records/operation/db-data-table-row-delete)",
  version: "0.0.8",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
      return this.nocodb.deleteTableRow({
        tableId: this.tableId.value,
        data: {
          Id: this.rowId,
        },
        $,
      });
    },
    getSummary() {
      return `Record Successfully deleted in ${this.tableId.label} table!`;
    },
  },
};
