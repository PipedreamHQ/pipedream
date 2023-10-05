import app from "../../microsoft_sql_server.app.mjs";

export default {
  key: "microsoft_sql_server-execute-query",
  name: "Execute Query",
  description: "Executes a SQL query and returns the results. [See the documentation](https://learn.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql?view=sql-server-ver16)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "The SQL query to execute",
      default: "select * from mytable where id = @input_parameter",
    },
    inputs: {
      type: "object",
      label: "Inputs",
      description: "The inputs to the query. These will be available as @input_parameter in the query. For example, if you provide an input named 'id', you can use @id in the query.",
      optional: true,
    },
  },
  run({ $: step }) {
    const {
      app,
      inputs,
      query,
    } = this;

    return app.executeQuery({
      step,
      query,
      inputs,
      summary: () => "Successfully executed query.",
    });
  },
};
