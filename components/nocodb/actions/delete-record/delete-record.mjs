import common from "../common/base.mjs";

export default {
  ...common,
  key: "nocodb-delete-record",
  name: "Delete Record",
  description: "This action deletes a row in a table. [See the docs here](https://all-apis.nocodb.com/#tag/DB-table-row/operation/db-table-row-delete)",
  version: "0.0.1",
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
      return await this.nocodb.deleteTableRow({
        projectId,
        tableName: tableName.value,
        rowId,
      });
    },
    getSummary() {
      return `Record Successfully deleted in ${this.tableName.label} table!`;
    },
  },
};
