import app from "../../nasdaq_data_link_time_series_and_table_data_.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "nasdaq_data_link_time_series_and_table_data_-export-table",
  name: "Export Table (Bulk Download)",
  description: "Exports an entire table or a filtered subset as a zipped CSV file. Returns a download link for the data. Premium subscribers can use this feature up to 60 times per hour. [See the documentation](https://docs.data.nasdaq.com/docs/large-table-download)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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

    const response = await app.tableData({
      $,
      publisher,
      table,
      params: {
        "qopts.export": true,
        ...utils.parseJson(filters),
        ...utils.parseJson(filterOperators),
        ...(Array.isArray(columns) && columns?.length
          ? {
            "qopts.columns": columns.join(","),
          }
          : undefined
        ),
      },
    });

    const status = response?.datatable_bulk_download?.file?.status;
    const link = response?.datatable_bulk_download?.file?.link;

    if (status === "fresh" && link) {
      $.export("$summary", `Table ${publisher}/${table} is ready for download. The download link is valid for 30 minutes.`);

    } else if (status === "creating" || status === "regenerating") {
      $.export("$summary", `Export job for table ${publisher}/${table} is ${status}. Please retry in a few moments to get the download link.`);

    } else {
      $.export("$summary", `Export initiated for table ${publisher}/${table}`);
    }

    return response;
  },
};
