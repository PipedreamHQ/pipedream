import common from "../common/base.mjs";

export default {
  ...common,
  key: "nocodb-add-record",
  name: "Add Record",
  description: "This action adds a record in a table. [See the documentation](https://data-apis-v2.nocodb.com/#tag/Table-Records/operation/db-data-table-row-create)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
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
      return this.nocodb.createTableRow({
        tableId: this.tableId.value,
        data,
        $,
      });
    },
    getSummary() {
      return `Record Successfully added in ${this.tableId.label} table!`;
    },
  },
};
