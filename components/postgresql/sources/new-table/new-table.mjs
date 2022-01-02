import postgresql from "../../postgresql.app.mjs";

export default {
  name: "New Table",
  key: "postgresql-new-table",
  description: "Emit new event when you add a new table",
  version: "0.0.1",
  type: "source",
  props: {
    postgresql,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
      label: "Polling Interval",
      description: "Pipedream will poll the API on this schedule",
    },
  },
  methods: {
    _getPreviousTables() {
      return this.db.get("previousTables");
    },
    _setPreviousTables(previousTables) {
      this.db.set("previousTables", previousTables);
    },
    generateMeta(table) {
      return {
        id: table,
        summary: `New table: ${table}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const client = await this.postgresql.getClient();
    const previousTables = this._getPreviousTables() || [];

    const results = await this.postgresql.getTables(client);
    const tables = [];
    for (const result of results) {
      tables.push(result.table_name);
    }

    const newTables = tables.filter((x) => !previousTables.includes(x));
    for (const table of newTables) {
      const meta = this.generateMeta(table);
      this.$emit(table, meta);
    }

    this._setPreviousTables(tables);
    await this.postgresql.endClient(client);
  },
};
