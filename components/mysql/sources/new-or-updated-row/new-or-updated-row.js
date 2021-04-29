const common = require("../common.js");

module.exports = {
  ...common,
  key: "mysql-new-or-updated-row",
  name: "New or Updated Row",
  description: "Emits an event when you add or modify a new row in a table",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    table: { propDefinition: [common.props.mysql, "table"] },
    column: {
      propDefinition: [
        common.props.mysql,
        "column",
        (c) => ({ table: c.table }),
      ],
      label: "Order By",
      description:
        "A datetime column, such as 'date_updated' or 'last_modified' that is set to the current datetime when a row is updated.",
    },
  },
  hooks: {
    async deploy() {
      const connection = await this.mysql.getConnection();
      await this.listTopRows(connection, this.column);
      await this.mysql.closeConnection(connection);
    },
  },
  methods: {
    ...common.methods,
    async listResults(connection) {
      await this.listRowResults(connection, this.column);
    },
    generateMeta(row) {
      return {
        id: JSON.stringify(row),
        summary: `New Row Added/Updated ${row[this.column]}`,
        ts: Date.now(),
      };
    },
  },
};