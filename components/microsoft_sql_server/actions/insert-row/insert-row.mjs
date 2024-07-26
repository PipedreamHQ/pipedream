import app from "../../microsoft_sql_server.app.mjs";

export default {
  key: "microsoft_sql_server-insert-row",
  name: "Insert Row",
  description: "Inserts a new row in a table. [See the documentation](https://learn.microsoft.com/en-us/sql/t-sql/statements/insert-transact-sql?view=sql-server-ver16)",
  type: "action",
  version: "0.0.4",
  props: {
    app,
    table: {
      description: "The table to insert a row to",
      propDefinition: [
        app,
        "table",
      ],
      reloadProps: true,
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
  async run({ $: step }) {
    const {
      app,
      table,
      ...inputs
    } = this;

    const response = await app.insertRow({
      table,
      inputs,
    });
    step.export("$summary", "Successfully inserted row.");
    return response;
  },
};
