import app from "../../microsoft_sql_server.app.mjs";

export default {
  key: "microsoft_sql_server-execute-raw-query",
  name: "Execute SQL Query",
  description: "Execute a custom SQL query. See [our docs](https://pipedream.com/docs/databases/working-with-sql) to learn more about working with SQL in Pipedream.",
  type: "action",
  version: "0.0.3",
  props: {
    app,
    // eslint-disable-next-line pipedream/props-description
    sql: {
      type: "sql",
      auth: {
        app: "app",
      },
      label: "SQL Query",
    },
  },
  async run({ $ }) {
    const args = this.app.executeQueryAdapter(this.sql);
    const response = await this.app.executeQuery(args);
    $.export("$summary", "Successfully executed query.");
    return response;
  },
};
