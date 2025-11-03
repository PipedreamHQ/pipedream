import app from "../../azure_sql.app.mjs";

export default {
  key: "azure_sql-execute-query",
  name: "Execute Query",
  description: "Executes a SQL query and returns the results. [See the documentation](https://learn.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql?view=azuresqldb-current)",
  type: "action",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    requestTimeout: {
      propDefinition: [
        app,
        "requestTimeout",
      ],
    },
  },
  run({ $ }) {
    const {
      app,
      inputs,
      query,
      requestTimeout,
    } = this;

    return app.executeQuery({
      $,
      query,
      inputs,
      requestTimeout,
      summary: () => "Successfully executed query.",
    });
  },
};
