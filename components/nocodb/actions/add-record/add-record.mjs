import common from "../common/base.mjs";

export default {
  ...common,
  key: "nocodb-add-record",
  name: "Add Record",
  description: "This action adds a record in a table. [See the docs here](https://all-apis.nocodb.com/#tag/DB-table-row/operation/db-table-row-create)",
  version: "0.0.1",
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
    async processEvent() {
      const {
        projectId,
        tableName,
        data,
      } = this;
      return this.nocodb.createTableRow({
        projectId,
        tableName: tableName.value,
        data,
      });
    },
    getSummary() {
      return `Record Successfully added in ${this.tableName.label} table!`;
    },
  },
};
