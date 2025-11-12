import app from "../../azure_sql.app.mjs";

export default {
  key: "azure_sql-insert-row",
  name: "Insert Row",
  description: "Inserts a new row in a table. [See the documentation](https://learn.microsoft.com/en-us/sql/t-sql/statements/insert-transact-sql?view=azuresqldb-current)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    table: {
      description: "The table to insert a row into",
      propDefinition: [
        app,
        "table",
      ],
      reloadProps: true,
    },
    requestTimeout: {
      propDefinition: [
        app,
        "requestTimeout",
      ],
    },
  },
  async additionalProps() {
    const {
      app,
      table,
    } = this;

    const { recordset } = await app.listColumns({
      table,
    });
    const columnNames = recordset.map(({ COLUMN_NAME: columnName }) => columnName);
    return columnNames.reduce((acc, columnName) => ({
      ...acc,
      [columnName]: {
        type: "string",
        label: columnName,
        description: `The value for the ${columnName} column`,
        optional: true,
      },
    }), {});
  },
  run({ $ }) {
    const {
      app,
      table,
      requestTimeout,
      ...inputs
    } = this;

    return app.insertRow({
      $,
      table,
      inputs,
      requestTimeout,
      summary: () => "Successfully inserted row.",
    });
  },
};
