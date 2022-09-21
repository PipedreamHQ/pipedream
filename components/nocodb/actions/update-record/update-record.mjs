import common from "../common/base.mjs";

export default {
  ...common,
  key: "nocodb-update-record",
  name: "Update Record",
  description: "This action updates a record in a table. [See the docs here](https://all-apis.nocodb.com/#tag/DB-table-row/operation/db-table-row-update)",
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
    data: {
      propDefinition: [
        common.props.nocodb,
        "data",
      ],
    },
  },
  methods: {
    async processEvent() {
      const {
        projectId,
        tableName,
        rowId,
        data,
      } = this;
      return this.nocodb.updateTableRow({
        projectId,
        tableName: tableName.value,
        rowId,
        data,
      });
    },
    getSummary() {
      return `Successfully updated row in ${this.tableName.label} table`;
    },
  },
};
