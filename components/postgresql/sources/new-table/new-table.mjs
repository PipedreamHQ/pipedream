import common from "../common.mjs";

export default {
  ...common,
  name: "New Table",
  key: "postgresql-new-table",
  description: "Emit new event when a new table is added to the database",
  version: "0.0.4",
  type: "source",
  async run() {
    const previousTables = this._getPreviousValues() || [];

    const tables = await this.postgresql.getTables();

    const newTables = tables.filter((table) => !previousTables.includes(table));
    for (const table of newTables) {
      const meta = this.generateMeta(table);
      this.$emit(table, meta);
    }

    this._setPreviousValues(tables);
  },
};
