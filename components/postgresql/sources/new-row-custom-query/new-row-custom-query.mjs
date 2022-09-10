import common from "../common.mjs";

export default {
  ...common,
  name: "New Row Custom Query",
  key: "postgresql-new-row-custom-query",
  description: "Emit new event when new rows are returned from a custom query that you provide",
  version: "0.0.5",
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
    values: {
      propDefinition: [
        common.props.postgresql,
        "values",
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
    const {
      table,
      column,
      query,
      values = [],
    } = this;

    if (!Array.isArray(values)) {
      throw new Error("No valid values provided. The values property must be an array.");
    }

    const numberOfValues = query?.match(/\$/g)?.length || 0;
    if (values.length !== numberOfValues) {
      throw new Error("The number of values provided does not match the number of values in the query.");
    }

    const isColumnUnique = await this.isColumnUnique(table, column);
    if (!isColumnUnique) {
      throw new Error("The column selected contains duplicate values. Column must be unique");
    }

    const rows = await this.postgresql.executeQuery({
      text: query,
      values,
    });
    for (const row of rows) {
      const meta = this.generateMeta(row, column);
      this.$emit(row, meta);
    }
  },
};
