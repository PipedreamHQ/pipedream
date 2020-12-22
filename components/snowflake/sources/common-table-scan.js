const { isNil } = require("lodash");
const snowflake = require("../snowflake.app");

module.exports = {
  props: {
    snowflake,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The name of the table to watch for new rows",
      async options(context) {
        const { page } = context;
        if (page !== 0) {
          return [];
        }

        const options = await this.snowflake.listTables();
        return options.map(i => i.name);
      },
    },
    uniqueKey: {
      type: "string",
      label: "Unique Key",
      description: "The name of a column in the table to use for deduplication. Defaults to `ID`",
      default: "ID",
      async options(context) {
        const { page } = context;
        if (page !== 0) {
          return [];
        }

        const options = await this.snowflake.listFieldsForTable(this.tableName);
        return options.map(i => i.name);
      },
    },
    eventSize: {
      type: "integer",
      label: "Event Size",
      description: "The number of rows to include in a single event (by default, emits 1 event per row)",
      default: 1,
      min: 1,
    },
  },
  hooks: {
    async activate() {
      let lastResultId = this.db.get("lastResultId");
      if (isNil(lastResultId)) {
        lastResultId = await this._getLastId();
        this.db.set("lastResultId", lastResultId);
      }

      console.log(`
        Starting scan of table "${this.tableName}" from ${this.uniqueKey}=${lastResultId}
      `);
    },
  },
  methods: {
    async _getLastId() {
      const sqlText = `
        SELECT ${this.uniqueKey}
        FROM ${this.tableName}
        ORDER BY ${this.uniqueKey} DESC
        LIMIT 1
      `;
      const statement = {
        sqlText,
      };
      const rowStream = await this.snowflake.getRows(statement);
      for await (const row of rowStream) {
        return row[this.uniqueKey];
      }
      return 0;
    },
    async processCollection(statement, timestamp) {
      let lastResultId;
      let totalRowCount = 0;
      const rowCollectionStream = this.snowflake.collectRowsPaginated(statement, this.eventSize);
      for await (const rows of rowCollectionStream) {
        const rowCount = rows.length;
        if (rowCount <= 0) {
          break;
        }

        lastResultId = rows[rowCount-1][this.uniqueKey];
        totalRowCount += rowCount;
        const meta = this.generateMetaForCollection({
          lastResultId,
          rowCount,
          timestamp,
        });
        this.$emit({ rows }, meta);
      }
      return {
        lastResultId,
        rowCount: totalRowCount,
      }
    },
    async processSingle(statement, timestamp) {
      let lastResultId;
      let rowCount = 0;
      const rowStream = await this.snowflake.getRows(statement);
      for await (const row of rowStream) {
        const meta = this.generateMeta({
          row,
          timestamp,
        });
        this.$emit(row, meta);

        lastResultId = row[this.uniqueKey];
        ++rowCount;
      }

      return {
        lastResultId,
        rowCount,
      };
    },
    generateMeta() {
      throw new Error('generateMeta is not implemented');
    },
    generateMetaForCollection() {
      throw new Error('generateMetaForCollection is not implemented');
    },
    processEvent() {
      throw new Error('processEvent is not implemented');
    },
  },
  async run(event) {
    const prevLastResultId = this.db.get("lastResultId");
    const {
      lastResultId = prevLastResultId,
    } = await this.processEvent(prevLastResultId, event);
    this.db.set("lastResultId", lastResultId);
  },
};
