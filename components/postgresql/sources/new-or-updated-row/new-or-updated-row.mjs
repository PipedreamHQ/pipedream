import common from "../common.mjs";

export default {
  ...common,
  name: "New or Updated Row",
  key: "postgresql-new-or-updated-row",
  description: "Emit new event when a row is added or modified",
  version: "0.0.1",
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
      description: "A datetime column, such as 'date_updated' or 'last_modified' that is set to the current datetime when a row is updated.",
    },
  },
  methods: {
    ...common.methods,
    generateMeta(row, column) {
      return {
        id: row[column],
        summary: "Row Added/Updated",
        ts: row[column],
      };
    },
  },
  async run() {
    const {
      table,
      column,
    } = this;

    const isColumnUnique = await this.isColumnUnique(table, column);
    if (!isColumnUnique) {
      throw new Error("The column selected contains duplicate values. Column must be unique");
    }

    await this.newRows(table, column);
  },
};
