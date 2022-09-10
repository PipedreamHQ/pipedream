import common from "../common.mjs";

export default {
  ...common,
  name: "New or Updated Row",
  key: "postgresql-new-or-updated-row",
  description: "Emit new event when a row is added or modified",
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
    identifierColumn: {
      label: "Identifier Column",
      propDefinition: [
        common.props.postgresql,
        "column",
        (c) => ({
          table: c.table,
        }),
      ],
      description: "The column to identify an unique row, commonly it's `id` or `uuid`.",
    },
    timestampColumn: {
      label: "Timestamp Column",
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
  hooks: {
    async deploy() {
      await this.initialRows(this.table, this.timestampColumn);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(row, column) {
      return {
        id: `${row[this.identifierColumn]}-${row[column]}`,
        summary: "Row Added/Updated",
        ts: row[column],
      };
    },
  },
  async run() {
    await this.newRows(this.table, this.timestampColumn);
  },
};
