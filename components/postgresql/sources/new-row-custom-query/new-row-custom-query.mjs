import common from "../common.mjs";

export default {
  ...common,
  name: "New Row Custom Query",
  key: "postgresql-new-row-custom-query",
  description: "Emit new event when new rows are returned from a custom query that you provide",
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
    },
    query: {
      propDefinition: [
        common.props.postgresql,
        "query",
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(row, column) {
      return {
        id: row[column],
        summary: "New Row",
        ts: Date.now(),
      };
    },
  },
  async run() {
    const rows = await this.postgresql.executeQuery(this.query);
    for (const row of rows) {
      const meta = this.generateMeta(row, this.column);
      this.$emit(row, meta);
    }
  },
};
