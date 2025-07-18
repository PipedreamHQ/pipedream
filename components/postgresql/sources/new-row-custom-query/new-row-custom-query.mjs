import common from "../common.mjs";

export default {
  ...common,
  name: "New Row Custom Query",
  key: "postgresql-new-row-custom-query",
  description: "Emit new event when new rows are returned from a custom query that you provide. [See the documentation](https://node-postgres.com/features/queries)",
  version: "2.0.8",
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
    column: {
      propDefinition: [
        common.props.postgresql,
        "column",
        (c) => ({
          table: c.table,
          schema: c.schema,
        }),
      ],
    },
    query: {
      propDefinition: [
        common.props.postgresql,
        "query",
      ],
      description: "Specify the query to select new or updated rows since the last poll. For example, `SELECT * FROM users WHERE country = 'US'`",
    },
    values: {
      propDefinition: [
        common.props.postgresql,
        "values",
      ],
    },
  },
  hooks: {
    async deploy() {
      if (this.values && !Array.isArray(this.values)) {
        throw new Error("No valid values provided. The values property must be an array.");
      }

      const numberOfValues = this.query?.match(/\$/g)?.length || 0;
      if (this.values && this.values.length !== numberOfValues) {
        throw new Error("The number of values provided does not match the number of values in the query.");
      }

      const isColumnUnique = await this.isColumnUnique(this.schema, this.table, this.column);
      if (!isColumnUnique) {
        throw new Error("The column selected contains duplicate values. Column must be unique");
      }
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
    const rows = await this.postgresql.executeQuery({
      text: this.query,
      values: this.values,
    });
    for (const row of rows) {
      const meta = this.generateMeta(row, this.column);
      this.$emit(row, meta);
    }
  },
};
