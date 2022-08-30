import common from "../common.mjs";

export default {
  ...common,
  name: "New Row",
  key: "postgresql-new-row",
  description: "Emit new event when a new row is added to a table",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    table: {
      propDefinition: [
        common.props.postgresql,
        "table",
      ],
    },
    column: {
      propDefinition: [
        common.props.postgresql,
        "column",
        (c) => ({
          table: c.table,
        }),
      ],
      optional: true,
    },
  },
  hooks: {
    /** If column prop is left blank, get the table's primary key to use
     * for ordering and deduping. */
    async deploy() {
      const column = this.column
        ? this.column
        : await this.postgresql.getPrimaryKey(this.table);
      this._setColumn(column);
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

    const isColumnUnique = await this.isColumnUnique(this.table, column);
    if (!isColumnUnique) {
      throw new Error("The column selected contains duplicate values. Column must be unique");
    }

    await this.newRows(this.table, column, false);
  },
};
