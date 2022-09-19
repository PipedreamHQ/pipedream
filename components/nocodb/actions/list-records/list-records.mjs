import common from "../common/base.mjs";

export default {
  ...common,
  key: "nocodb-list-records",
  name: "List Records in Table",
  description: "This action lists all rows in a table. [See the docs here](https://all-apis.nocodb.com/#tag/DB-table-row/operation/db-table-row-list)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    sort: {
      propDefinition: [
        common.props.nocodb,
        "sort",
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
        sort,
        limit,
      } = this;

      const params = {
        projectId,
        tableName: tableName.value,
        query: {
          sort,
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
