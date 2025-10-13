import common from "../common/table.mjs";

const { mysql } = common.props;

export default {
  ...common,
  key: "mysql-new-row",
  name: "New Row",
  description:
    "Emit new event when you add a new row to a table. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
  type: "source",
  version: "2.0.6",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    column: {
      propDefinition: [
        mysql,
        "column",
        (c) => ({
          table: c.table,
        }),
      ],
      optional: true,
    },
  },
  hooks: {
    /**
     * If column prop is left blank, get the table's primary key to use for ordering and deduping.
     * */
    async deploy() {
      const { table } = this;
      let column = this.column;

      if (!column) {
        const keyData = await this.mysql.getPrimaryKey({
          table,
        });
        column = keyData[0].Column_name;
      }

      this._setColumn(column);

      await this.listTopRows(column);
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
    async listResults() {
      const column = this._getColumn();
      await this.listRowResults(column);
    },
    iterateAndEmitEvents(rows) {
      const column = this._getColumn();
      for (const row of rows) {
        const meta = this.generateMeta(row, column);
        this.$emit(row, meta);
      }
    },
    generateMeta(row, column) {
      return {
        id: row[column],
        summary: `New Row Added ${column}: ${row[column]}`,
        ts: Date.now(),
      };
    },
  },
};
