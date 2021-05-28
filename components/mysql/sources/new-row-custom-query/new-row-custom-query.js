const common = require("../common.js");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  ...common,
  key: "mysql-new-row-custom-query",
  name: "New Row (Custom Query)",
  description: "Emits an event when new rows are returned from a custom query",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    table: { propDefinition: [common.props.mysql, "table"] },
    column: {
      propDefinition: [
        common.props.mysql,
        "column",
        (c) => ({ table: c.table }),
      ],
      label: "De-duplication Key",
      description:
        "The name of a column in the table to use for de-duplication",
      optional: true,
    },
    query: { propDefinition: [common.props.mysql, "query"] },
  },
  methods: {
    ...common.methods,
    async listResults(connection) {
      const rows = await this.mysql.executeQuery(connection, this.query);
      this.iterateAndEmitEvents(rows);
    },
    generateMeta(row) {
      const id = this.column ? row[this.column] : uuidv4();
      return {
        id,
        summary: `New Row ${id}`,
        ts: Date.now(),
      };
    },
  },
};