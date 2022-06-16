import snowflake from "../snowflake.app.mjs";

export default {
  dedupe: "unique",
  props: {
    snowflake,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
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
  methods: {
    async processCollection(statement, timestamp) {
      let lastResultId;
      let totalRowCount = 0;
      const rowCollectionStream = this.snowflake.collectRowsPaginated(statement, this.eventSize);
      for await (const rows of rowCollectionStream) {
        const rowCount = rows.length;
        if (rowCount <= 0) {
          break;
        }

        lastResultId = rows[rowCount - 1][this.uniqueKey];
        totalRowCount += rowCount;
        const meta = this.generateMetaForCollection({
          lastResultId,
          rowCount,
          timestamp,
        });
        this.$emit({
          rows,
        }, meta);
      }
      return {
        lastResultId,
        rowCount: totalRowCount,
      };
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
    getStatement() {
      throw new Error("getStatement is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    generateMetaForCollection() {
      throw new Error("generateMetaForCollection is not implemented");
    },
    processEvent() {
      throw new Error("processEvent is not implemented");
    },
  },
  async run(event) {
    const { timestamp } = event;
    const statement = this.getStatement(event);
    return this.eventSize === 1
      ? this.processSingle(statement, timestamp)
      : this.processCollection(statement, timestamp);
  },
};
