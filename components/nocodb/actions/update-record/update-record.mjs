import common from "../common/base.mjs";

export default {
  ...common,
  key: "nocodb-update-record",
  name: "Update Record",
  description: "This action updates a record in a table. [See the documentation](https://data-apis-v2.nocodb.com/#tag/Table-Records/operation/db-data-table-row-update)",
  version: "0.0.6",
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
    data: {
      propDefinition: [
        common.props.nocodb,
        "data",
      ],
    },
  },
  methods: {
    async processEvent($) {
      const data = typeof this.data === "string"
        ? JSON.parse(this.data)
        : this.data;
      return this.nocodb.updateTableRow({
        tableId: this.tableId.value,
        data: {
          Id: this.rowId,
          ...data,
        },
        $,
      });
    },
    getSummary() {
      return `Successfully updated row in ${this.tableId.label} table`;
    },
  },
};
