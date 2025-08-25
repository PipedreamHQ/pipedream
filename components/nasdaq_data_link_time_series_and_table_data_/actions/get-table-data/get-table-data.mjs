import app from "../../nasdaq_data_link_time_series_and_table_data_.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "nasdaq_data_link_time_series_and_table_data_-get-table-data",
  name: "Get Table Data",
  description: "Retrieves data from a specific Nasdaq Data Link table with automatic pagination. Supports filtering by columns and rows. [See the documentation](https://docs.data.nasdaq.com/docs/tables-1)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    publisher: {
      propDefinition: [
        app,
        "publisher",
      ],
    },
    table: {
      propDefinition: [
        app,
        "table",
      ],
    },
    columns: {
      propDefinition: [
        app,
        "columns",
        ({
          publisher, table,
        }) => ({
          publisher,
          table,
        }),
      ],
    },
    filters: {
      type: "object",
      label: "Row Filters",
      description: "Filter rows based on column values. Use column names as keys and values to filter by. For example: `{ \"ticker\": \"SPY\", \"date\": \"2024-01-01\" }`. Only filterable columns can be used (check table metadata).",
      optional: true,
    },
    filterOperators: {
      type: "object",
      label: "Filter Operators",
      description: "Apply operators to filters. Format: `{ \"column.operator\": \"value\" }`. Available operators: `.gt` (greater than), `.lt` (less than), `.gte` (greater than or equal), `.lte` (less than or equal). Example: `{ \"date.gte\": \"2024-01-01\", \"date.lte\": \"2024-12-31\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      publisher,
      table,
      columns,
      filters,
      filterOperators,
    } = this;

    const response = await app.paginate({
      fn: app.tableData,
      args: {
        $,
        publisher,
        table,
        params: {
          ...utils.parseJson(filters),
          ...utils.parseJson(filterOperators),
          ...(Array.isArray(columns) && columns?.length
            ? {
              "qopts.columns": columns.join(","),
            }
            : undefined
          ),
        },
      },
    });

    $.export("$summary", `Successfully retrieved ${response.length} records`);
    return response;
  },
};
