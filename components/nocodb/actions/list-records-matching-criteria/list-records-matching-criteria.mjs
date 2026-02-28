import common from "../common/base.mjs";

export default {
  ...common,
  key: "nocodb-list-records-matching-criteria",
  name: "List Records in Table Matching Criteria",
  description: "This action lists all rows in a table. [See the documentation](https://data-apis-v2.nocodb.com/#tag/Table-Records/operation/db-data-table-row-list)",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    fields: {
      propDefinition: [
        common.props.nocodb,
        "fields",
        (c) => ({
          tableId: c.tableId.value,
        }),
      ],
      optional: true,
    },
    sort: {
      propDefinition: [
        common.props.nocodb,
        "sort",
        (c) => ({
          tableId: c.tableId.value,
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
    async processEvent($) {
      const rows = [];
      const paginator = this.nocodb.paginate({
        fn: this.nocodb.listTableRow,
        args: {
          tableId: this.tableId.value,
          params: {
            fields: this.fields,
            sort: this.sort,
            where: this.where,
          },
        },
        max: this.limit,
        $,
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

      return `Returned ${response.length} row${suffix} from ${this.tableId.label} table`;
    },
  },
};
