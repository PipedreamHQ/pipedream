import common from "../common.mjs";

export default {
  ...common,
  name: "New or Updated Row",
  key: "postgresql-new-or-updated-row",
  description: "Emit new event when a row is added or modified. [See Docs](https://node-postgres.com/features/queries)",
  version: "0.0.9",
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
    identifierColumn: {
      label: "Identifier Column",
      propDefinition: [
        common.props.postgresql,
        "column",
        (c) => ({
          table: c.table,
          schema: c.schema,
          rejectUnauthorized: c.rejectUnauthorized,
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
          schema: c.schema,
          rejectUnauthorized: c.rejectUnauthorized,
        }),
      ],
      description: "A datetime column, such as 'date_updated' or 'last_modified' that is set to the current datetime when a row is updated.",
    },
  },
  hooks: {
    async deploy() {
      await this.initialRows(this.schema,
        this.table,
        this.timestampColumn,
        this.limit,
        this.rejectUnauthorized);
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
