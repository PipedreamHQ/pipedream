import app from "../../microsoft_sql_server.app.mjs";

export default {
  key: "microsoft_sql_server-execute-raw-query",
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
        app: "microsoft_sql_server",
      },
      label: "SQL Query",
    },
  },
  async run({ $: step }) {
    const {
      query, params,
    } = this.app.executeQueryAdapter(this.sql);
    const response = await this.app.executeQuery({
      query,
      inputs: params || {},
    });
    step.export("$summary", "Successfully executed query.");
    return response;
  },
};
