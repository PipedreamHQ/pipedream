import app from "../../nasdaq_data_link_time_series_and_table_data_.app.mjs";

export default {
  key: "nasdaq_data_link_time_series_and_table_data_-get-table-metadata",
  name: "Get Table Metadata",
  description: "Retrieves metadata for a specific Nasdaq Data Link table, including column names, types, filterable columns, and primary keys. [See the documentation](https://docs.data.nasdaq.com/docs/tables-1)",
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
  },
  async run({ $ }) {
    const {
      app,
      publisher,
      table,
    } = this;

    const response = await app.tableMetadata({
      $,
      publisher,
      table,
    });

    $.export("$summary", `Successfully retrieved metadata for table \`${publisher}/${table}\``);
    return response;
  },
};
