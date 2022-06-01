import common from "./common.mjs";
import { isString } from "lodash-es";

export default {
  ...common,
  props: {
    ...common.props,
    tableName: {
      propDefinition: [
        common.props.snowflake,
        "tableName",
      ],
      description: "The name of the table to watch for new rows",
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
        return options.map((i) => i.name);
      },
    },
  },
  hooks: {
    ...common.hooks,
    async activate() {
      await this.validateColumn(this.uniqueKey);

      let lastResultId = this.db.get("lastResultId");
      if (lastResultId === undefined) {
        lastResultId = await this._getLastId();
        this.db.set("lastResultId", lastResultId);
      }

      console.log(`
        Starting scan of table "${this.tableName}" from ${this.uniqueKey}=${lastResultId}
      `);
    },
  },
  methods: {
    ...common.methods,
    /**
     * Utility method to make sure that a certain column exists in the target
     * table. Useful for SQL query sanitizing.
     *
     * @param {string} columnNameToValidate The name of the column to validate
     * for existence
     */
    async validateColumn(columnNameToValidate) {
      if (!isString(columnNameToValidate)) {
        throw new Error("columnNameToValidate must be a string");
      }

      const columns = await this.snowflake.listFieldsForTable(this.tableName);
      const columnNames = columns.map((i) => i.name);
      if (!columnNames.includes(columnNameToValidate)) {
        throw new Error(`Inexistent column: ${columnNameToValidate}`);
      }
    },
    generateMeta(data) {
      const {
        row: { [this.uniqueKey]: id },
        timestamp: ts,
      } = data;
      const summary = `New row: ${id}`;
      return {
        id,
        summary,
        ts,
      };
    },
    generateMetaForCollection(data) {
      const {
        lastResultId: id,
        rowCount,
        timestamp: ts,
      } = data;
      const entity = rowCount === 1
        ? "row"
        : "rows";
      const summary = `${rowCount} new ${entity}`;
      return {
        id,
        summary,
        ts,
      };
    },
    async _getLastId() {
      const sqlText = `
        SELECT ${this.uniqueKey}
        FROM IDENTIFIER(:1)
        ORDER BY ${this.uniqueKey} DESC
        LIMIT 1
      `;
      const binds = [
        this.tableName,
        this.uniqueKey,
      ];
      const statement = {
        sqlText,
        binds,
      };
      const rowStream = await this.snowflake.getRows(statement);
      for await (const row of rowStream) {
        return row[this.uniqueKey];
      }
      return 0;
    },
  },
  async run(event) {
    const prevLastResultId = this.db.get("lastResultId");
    const statement = await this.getStatement(prevLastResultId);

    const { timestamp } = event;
    const { lastResultId = prevLastResultId } = (this.eventSize === 1) ?
      await this.processSingle(statement, timestamp) :
      await this.processCollection(statement, timestamp);
    this.db.set("lastResultId", lastResultId);
  },
};
