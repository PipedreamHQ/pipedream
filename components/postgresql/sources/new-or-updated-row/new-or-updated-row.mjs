import common from "../common.mjs";

export default {
  ...common,
  name: "New or Updated Row",
  key: "postgresql-new-or-updated-row",
  description: "Emit new event when a row is added or modified. [See the documentation](https://node-postgres.com/features/queries)",
  version: "2.0.9",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    schema: {
      propDefinition: [
        common.props.postgresql,
        "schema",
      ],
    },
    table: {
      propDefinition: [
        common.props.postgresql,
        "table",
        (c) => ({
          schema: c.schema,
        }),
      ],
    },
    identifierColumn: {
      label: "Identifier Column",
      propDefinition: [
        common.props.postgresql,
        "column",
        (c) => ({
          table: c.table,
          schema: c.schema,
        }),
      ],
      description: "The column to identify an unique row, commonly its `id` or `uuid`.",
    },
    timestampColumn: {
      label: "Timestamp Column",
      propDefinition: [
        common.props.postgresql,
        "column",
        (c) => ({
          table: c.table,
          schema: c.schema,
        }),
      ],
      description: "A datetime column, such as 'date_updated' or 'last_modified' that is set to the current datetime when a row is updated.",
    },
  },
  hooks: {
    async deploy() {
      await this.initialRows(
        this.schema,
        this.table,
        this.timestampColumn,
        this.limit,
      );
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
    await this.newRows(this.schema, this.table, this.timestampColumn);
  },
};
