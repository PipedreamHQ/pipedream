import common from "../common/base.mjs";

export default {
  ...common,
  key: "nocodb-list-records-matching-criteria",
  name: "List Records in Table Matching Criteria",
  description: "This action lists all rows in a table. [See the docs here](https://all-apis.nocodb.com/#tag/DB-table-row/operation/db-table-row-list)",
  version: "0.0.3",
  type: "action",
  props: {
    ...common.props,
    fields: {
      propDefinition: [
        common.props.nocodb,
        "fields",
        (c) => ({
          tableId: c.tableName.value,
        }),
      ],
      optional: true,
    },
    sort: {
      propDefinition: [
        common.props.nocodb,
        "sort",
        (c) => ({
          tableId: c.tableName.value,
        }),
      ],
      optional: true,
    },
    where: {
      propDefinition: [
        common.props.nocodb,
        "where",
      ],
      optional: true,
    },
    limit: {
      propDefinition: [
        common.props.nocodb,
        "limit",
      ],
      optional: true,
    },
  },
  methods: {
    async processEvent() {
      const {
        projectId,
        tableName,
        fields,
        sort,
        where,
        limit,
      } = this;

      const params = {
        projectId,
        tableName: tableName.value,
        query: {
          fields,
          sort,
          where,
          limit,
        },
      };

      const rows = [];
      const paginator = this.nocodb.paginate({
        fn: this.nocodb.listTableRow,
        params,
      });
      for await (const row of paginator) {
        rows.push(row);
      }
      return rows;
    },
    getSummary(response) {
      const suffix = response.length === 1
        ? ""
        : "s";

      return `Returned ${response.length} row${suffix} from ${this.tableName.label} table`;
    },
  },
};
