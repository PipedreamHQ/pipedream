import postgresql from "../../postgresql.app.mjs";

export default {
  name: "New Row",
  key: "postgresql-new-row",
  description: "Adds a new row. [See Docs](https://node-postgres.com/features/queries)",
  version: "0.1.0",
  type: "action",
  props: {
    postgresql,
    table: {
      propDefinition: [
        postgresql,
        "table",
      ],
    },
    rowValues: {
      propDefinition: [
        postgresql,
        "rowValues",
      ],
    },
  },
  async run({ $ }) {
    const {
      table,
      rowValues,
    } = this;
    const columns = Object.keys(rowValues);
    const values = Object.values(rowValues);
    try {
      const res = await this.postgresql.insertRow(table, columns, values);
      $.export("$summary", "New row inserted");
      return res;
    } catch (error) {
      $.export("$summary", `New row not inserted due to an error. ${error}`);
    }
  },
};
