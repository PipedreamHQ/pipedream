import common from "../common/base.mjs";

export default {
  ...common,
  key: "nocodb-get-record",
  name: "Get Record (from row number)",
  description: "This action gets a row by row Id. [See the docs here](https://all-apis.nocodb.com/#tag/DB-table-row/operation/db-table-row-read)",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    rowId: {
      propDefinition: [
        common.props.nocodb,
        "rowId",
      ],
    },
  },
  methods: {
    async processEvent() {
      const {
        projectId,
        tableName,
        rowId,
      } = this;
      return this.nocodb.getTableRow({
        projectId,
        tableName: tableName.value,
        rowId,
      });
    },
    getSummary() {
      return `Record Successfully fetched from ${this.tableName.label} table!`;
    },
  },
};
