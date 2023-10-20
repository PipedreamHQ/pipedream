import common from "../common.mjs";

export default {
  ...common,
  name: "New Row",
  key: "postgresql-new-row",
  description: "Emit new event when a new row is added to a table. [See Docs](https://node-postgres.com/features/queries)",
  version: "1.0.7",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    schema: {
      propDefinition: [
        common.props.postgresql,
        "schema",
        (c) => ({
          rejectUnauthorized: c.rejectUnauthorized,
        }),
      ],
    },
    table: {
      propDefinition: [
        common.props.postgresql,
        "table",
        (c) => ({
          schema: c.schema,
          rejectUnauthorized: c.rejectUnauthorized,
        }),
      ],
    },
    column: {
      propDefinition: [
        common.props.postgresql,
        "column",
        (c) => ({
          schema: c.schema,
          table: c.table,
          rejectUnauthorized: c.rejectUnauthorized,
        }),
      ],
      description: "An ID or timestamp column where new rows will always contain larger values than the previous row. Defaults to the table's primary key.",
      optional: true,
    },
  },
  hooks: {
    /** If column prop is left blank, get the table's primary key to use
     * for ordering and deduping. */
    async deploy() {
      const column = this.column
        ? this.column
        : await this.postgresql.getPrimaryKey(this.table, this.schema, this.rejectUnauthorized);
      this._setColumn(column);

      await this.initialRows(this.schema, this.table, column);
    },
  },
  methods: {
    ...common.methods,
    _getColumn() {
      return this.db.get("column");
    },
    _setColumn(column) {
      this.db.set("column", column);
    },
    generateMeta(row, column) {
      return {
        id: row[column],
        summary: "New Row Added",
        ts: Date.now(),
      };
    },
  },
  async run() {
    const column = this._getColumn();
    const isColumnUnique = await this.isColumnUnique(this.schema, this.table, column);
    if (!isColumnUnique) {
      throw new Error("The column selected contains duplicate values. Column must be unique");
    }

    await this.newRows(this.schema, this.table, column);
  },
};
