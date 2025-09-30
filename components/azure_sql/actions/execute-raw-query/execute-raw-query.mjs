import app from "../../azure_sql.app.mjs";

export default {
  key: "azure_sql-execute-raw-query",
  name: "Execute SQL Query",
  description: "Execute a custom SQL query. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream.",
  type: "action",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    sql: {
      type: "sql",
      auth: {
        app: "app",
      },
      label: "SQL Query",
    },
    requestTimeout: {
      propDefinition: [
        app,
        "requestTimeout",
      ],
    },
  },
  async run({ $ }) {
    const args = this.app.executeQueryAdapter(this.sql);
    args.requestTimeout = this.requestTimeout;
    const response = await this.app.executeQuery(args);
    $.export("$summary", "Successfully executed query.");
    return response;
  },
};
