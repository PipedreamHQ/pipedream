import app from "../../azure_sql.app.mjs";

export default {
  key: "azure_sql-execute-raw-query",
  name: "Execute SQL Query",
  description: "Execute a custom SQL query. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream.",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-description
    sql: {
      type: "sql",
      auth: {
        app: "azure_sql",
      },
      label: "SQL Query",
    },
  },
  async run({ $ }) {
    const {
      query, inputs = {},
    } = this.app.executeQueryAdapter(this.sql);
    const response = await this.app.executeQuery({
      query,
      inputs,
    });
    $.export("$summary", "Successfully executed query.");
    return response;
  },
};
